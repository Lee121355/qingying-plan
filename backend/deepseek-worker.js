const ALLOWED_ORIGIN = 'https://lee121355.github.io';

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
        temperature: 0.4,
        max_tokens: 1100,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: '你是轻盈计划的营养助手，当前使用 DeepSeek V4.1 Flash。请结合用户资料、营养目标、当日计划及最近对话，用简洁中文提供可执行的日常饮食建议。必须只返回 JSON 对象，格式为 {"reply":"回答","suggestions":[{"meal":"早餐/午餐/晚餐/加餐","name":"日常餐饮名称","calories":整数,"grams":整数,"protein":数字,"carbs":数字}]}。只有确实适合加入计划时才返回 1 至 3 个 suggestions，否则返回空数组。食材和份量应常见、合理，营养数值为整餐估算。不诊断疾病，不推荐极端节食，不用保健品替代正餐；涉及疾病、孕期、药物或进食障碍时建议咨询医生或注册营养师。' },
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
