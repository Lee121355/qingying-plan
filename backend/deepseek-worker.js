const ALLOWED_ORIGIN = 'https://lee121355.github.io';

const NUTRITION_ASSISTANT_SYSTEM_PROMPT = [
  '你是“轻盈计划”网站内嵌的 AI 营养助手，专注轻食方案定制。所有推荐必须遵循低油、控制精制糖、高纤维、优质蛋白搭配复合碳水的原则，不推荐重油重盐、油炸或高碳水浓酱菜品。',
  '',
  '回答规则：',
  '1. 完整读取用户资料、当日计划和最近对话，不答非所问，不使用固定模板套话。相同条件下主动改变菜品、食材或烹调方式，避免重复推荐。',
  '2. 从资料和对话中持续提取并记住过敏原/忌口、饮食目标（减脂/维持体重/增肌/控糖/养胃）、口味、可用食材、人数、餐次和预算。信息不足且确实影响回答时，只问 1 个最关键的问题，不同时追问多项；此时 suggestions 返回空数组。',
  '3. 存在过敏或忌口时必须完全规避，并在回复中明确标注。减脂要控制总热量并提高蛋白质和膳食纤维；维持体重要均衡；增肌要提高蛋白供给；控糖要选低 GI 复合碳水。不得推荐极端节食。',
  '4. 推荐具体餐食时，reply 必须按以下结构输出，保留换行：',
  '【轻食搭配方案】',
  '- 餐次：早餐/午餐/晚餐/加餐',
  '- 菜品名称｜制作难度：简单/中等｜预估耗时｜参考热量',
  '简单说明：风味特点、营养逻辑及适配用户目标的原因',
  '',
  '【食材清单】',
  '- 主料：使用克/个/勺等家用单位',
  '- 辅料：使用克/个/勺等家用单位',
  '- 调味：明确少油、少糖和少盐用量',
  '',
  '【简易制作步骤】',
  '1. 以 3 至 6 步说明，优先凉拌、蒸、煮或空气炸锅少油做法',
  '',
  '【轻食营养小贴士】',
  '- 说明蛋白质、碳水和脂肪的搭配逻辑',
  '- 标注忌口提醒、替换方案及分量调整建议',
  '- 最后一行固定为：本轻食方案仅为饮食搭配参考，不构成医疗、临床诊疗建议。患有基础疾病，请遵从医生或营养师专业指导。',
  '5. 用户询问食材替换、热量估算、食材能否搭配、营养分析或常见疑问时，直接回答该问题，不强行推荐菜品；仍要分段简洁并遵守轻食和过敏约束。',
  '6. 禁止大段密集文字，每段尽量简短。涉及疾病、孕期、药物、进食障碍或临床营养时，不做诊断，提示遵从医生或注册营养师指导。',
  '7. 除了只追问一个核心问题的简短回复外，每次完整回答末尾都必须附上指定免责声明。',
  '',
  '你必须只返回 JSON 对象，不得添加代码块或 JSON 之外的文字。格式为 {"reply":"包含换行的回答","suggestions":[{"meal":"早餐/午餐/晚餐/加餐","name":"轻食名称","calories":整数,"grams":整数,"protein":数字,"carbs":数字}]}。只有给出适合直接加入计划的具体餐食时，返回 1 至 3 个 suggestions；单纯答疑或追问时返回空数组。suggestions 必须与 reply 中的方案一致，数值为整餐合理估算。'
].join('\n');

function cors(origin) {
  const allowed = origin === ALLOWED_ORIGIN || origin?.startsWith('http://127.0.0.1:') || origin?.startsWith('http://localhost:');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = cors(origin);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
    if (origin && headers['Access-Control-Allow-Origin'] !== origin) return Response.json({ error: 'Origin not allowed' }, { status: 403, headers });
    if (!env.DEEPSEEK_API_KEY) return Response.json({ error: 'AI service is not configured' }, { status: 503, headers });

    let body;
    try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400, headers }); }
    const question = String(body.question || '').trim().slice(0, 1200);
    if (!question) return Response.json({ error: 'Question is required' }, { status: 400, headers });
    const history = Array.isArray(body.messages) ? body.messages.slice(-10).flatMap(message => {
      const role = message?.role === 'assistant' ? 'assistant' : message?.role === 'user' ? 'user' : '';
      const content = String(message?.content || '').trim().slice(0, 2000);
      return role && content ? [{ role, content }] : [];
    }) : [];
    const context = JSON.stringify({ profile: body.profile || {}, targets: body.targets || {}, selectedDayPlan: (body.plan || []).slice(0, 20) });
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: env.DEEPSEEK_MODEL || 'deepseek-flash',
        thinking: { type: 'disabled' },
        temperature: 0.65,
        max_tokens: 1600,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: NUTRITION_ASSISTANT_SYSTEM_PROMPT },
          { role: 'system', content: `当前用户数据：${context}` },
          ...history,
          { role: 'user', content: question }
        ]
      })
    });
    if (!response.ok) return Response.json({ error: 'DeepSeek request failed' }, { status: 502, headers });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return Response.json({ error: 'Empty model response' }, { status: 502, headers });
    let result;
    try { result = JSON.parse(content); } catch { result = { reply: content, suggestions: [] }; }
    const reply = String(result.reply || '').trim();
    if (!reply) return Response.json({ error: 'Empty model response' }, { status: 502, headers });
    const suggestions = Array.isArray(result.suggestions) ? result.suggestions.slice(0, 3) : [];
    return Response.json({ reply, suggestions, model: 'DeepSeek V4.1 Flash' }, { headers: { ...headers, 'Cache-Control': 'no-store' } });
  }
};
