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
    const context = JSON.stringify({ profile: body.profile || {}, targets: body.targets || {}, selectedDayPlan: (body.plan || []).slice(0, 20) });
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.45,
        max_tokens: 700,
        messages: [
          { role: 'system', content: '你是轻盈计划的营养助手。使用简洁中文回答，结合用户资料和当日计划给出日常可执行建议。不诊断疾病，不推荐极端节食或用保健品替代正餐。涉及疾病、孕期、药物或进食障碍时建议咨询医生或注册营养师。' },
          { role: 'user', content: `用户数据：${context}\n问题：${question}` }
        ]
      })
    });
    if (!response.ok) return Response.json({ error: 'DeepSeek request failed' }, { status: 502, headers });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return Response.json({ error: 'Empty model response' }, { status: 502, headers });
    return Response.json({ reply }, { headers: { ...headers, 'Cache-Control': 'no-store' } });
  }
};
