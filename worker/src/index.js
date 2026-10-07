const DEFAULT_ALLOWED_ORIGINS = [
  'https://lee121355.github.io',
  'http://localhost',
  'http://127.0.0.1'
];
const LOCAL_ORIGIN_PATTERN = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;
const PRIMARY_MODEL = '@cf/meta/llama-3.1-8b-instruct';
const FALLBACK_MODEL = '@cf/mistral/mistral-7b-instruct-v0.1';
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_OUTPUT_TOKENS = 1024;
const MINUTE_LIMIT = 10;
const DAY_LIMIT = 100;
const KV_MINUTE_TTL = 60;
const KV_DAY_TTL = 86400;
const MEMORY_LIMIT_STORE = new Map();

const SYSTEM_PROMPT = [
  '你是“轻盈计划”的 AI 助手，帮助用户管理饮食、营养、饮水和运动计划。',
  '请准确理解上下文，支持多轮对话；信息不足时只追问一个最关键的问题。',
  '推荐饮食时遵循低油、控糖、少盐、高纤维、优质蛋白搭配复合碳水的原则。',
  '使用清晰的 Markdown 回复；代码必须放在带语言标识的代码块中。',
  '不要编造用户数据、诊断疾病或承诺医疗效果。涉及疾病、孕期、用药或进食障碍时，提示咨询医生或注册营养师。',
  '如果用户的问题与健康管理无关，也可以正常、简洁地帮助回答。'
].join('\n');

function getAllowedOrigins(env) {
  const configured = String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
  return configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
}

function isAllowedOrigin(origin, env) {
  if (!origin) return false;
  return LOCAL_ORIGIN_PATTERN.test(origin) || getAllowedOrigins(env).includes(origin);
}

function corsHeaders(origin, env) {
  const allowed = isAllowedOrigin(origin, env);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'null',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function jsonResponse(payload, status, origin, env, extraHeaders = {}) {
  return Response.json(payload, {
    status,
    headers: {
      ...corsHeaders(origin, env),
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

function normalizeMessages(rawMessages) {
  if (!Array.isArray(rawMessages)) throw new Error('messages 必须是数组');
  if (!rawMessages.length) throw new Error('messages 不能为空');
  if (rawMessages.length > MAX_MESSAGES) throw new Error(`最多允许 ${MAX_MESSAGES} 条消息`);

  return rawMessages.map((message, index) => {
    const role = String(message?.role || '').trim();
    const content = String(message?.content || '').trim();
    if (!['system', 'user', 'assistant'].includes(role)) {
      throw new Error(`第 ${index + 1} 条消息的角色无效`);
    }
    if (!content) throw new Error(`第 ${index + 1} 条消息内容为空`);
    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`第 ${index + 1} 条消息超过 ${MAX_MESSAGE_LENGTH} 字符`);
    }
    return { role, content };
  });
}

function getClientIp(request) {
  const value = request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')
    || 'unknown';
  return value.split(',')[0].trim().slice(0, 80) || 'unknown';
}

function incrementMemoryLimit(key, limit, ttlSeconds) {
  const now = Date.now();
  const existing = MEMORY_LIMIT_STORE.get(key);
  if (!existing || existing.expiresAt <= now) {
    MEMORY_LIMIT_STORE.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 });
    return true;
  }
  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}

async function incrementKvLimit(env, key, limit, ttlSeconds) {
  const current = Number(await env.RATE_LIMIT_KV.get(key)) || 0;
  if (current >= limit) return false;
  await env.RATE_LIMIT_KV.put(key, String(current + 1), { expirationTtl: ttlSeconds });
  return true;
}

async function isRateLimited(env, request) {
  const ip = getClientIp(request);
  const minuteKey = `rate:minute:${ip}`;
  const dayKey = `rate:day:${ip}`;

  if (env.RATE_LIMIT_KV) {
    const minuteAllowed = await incrementKvLimit(env, minuteKey, MINUTE_LIMIT, KV_MINUTE_TTL);
    if (!minuteAllowed) return { limited: true, scope: 'minute' };
    const dayAllowed = await incrementKvLimit(env, dayKey, DAY_LIMIT, KV_DAY_TTL);
    return dayAllowed ? { limited: false } : { limited: true, scope: 'day' };
  }

  console.warn('[rate-limit] RATE_LIMIT_KV is not bound; using in-memory fallback');
  const minuteAllowed = incrementMemoryLimit(minuteKey, MINUTE_LIMIT, KV_MINUTE_TTL);
  if (!minuteAllowed) return { limited: true, scope: 'minute' };
  const dayAllowed = incrementMemoryLimit(dayKey, DAY_LIMIT, KV_DAY_TTL);
  return dayAllowed ? { limited: false } : { limited: true, scope: 'day' };
}

function selectModel(requestedModel, env) {
  const requested = String(requestedModel || '').trim();
  const primary = String(env.DEFAULT_MODEL || PRIMARY_MODEL).trim() || PRIMARY_MODEL;
  const fallback = String(env.FALLBACK_MODEL || FALLBACK_MODEL).trim() || FALLBACK_MODEL;
  const models = [primary, fallback];
  if (models.includes(requested)) return requested;
  return primary;
}

async function runModel(env, model, messages, stream) {
  return env.AI.run(model, {
    messages,
    stream,
    max_tokens: MAX_OUTPUT_TOKENS,
    temperature: 0.65
  });
}

function extractReply(result) {
  if (typeof result === 'string') return result.trim();
  return String(result?.response || result?.result?.response || result?.choices?.[0]?.message?.content || '').trim();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const pathname = new URL(request.url).pathname;
    // 根路径健康检查
    if (request.method === 'GET' && pathname === '/') {
  return new Response(JSON.stringify({
    status: 'ok',
    message: 'Worker is running. Use POST /api/chat',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
    if (!isAllowedOrigin(origin, env)) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, origin, env);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }

    if (pathname !== '/api/chat') {
      return jsonResponse({ error: 'Not found' }, 404, origin, env);
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin, env, { Allow: 'POST, OPTIONS' });
    }
    if (!env.AI) {
      return jsonResponse({ error: 'Workers AI binding is not configured' }, 503, origin, env);
    }

    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > 100000) {
      return jsonResponse({ error: 'Request body is too large' }, 413, origin, env);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400, origin, env);
    }

    let messages;
    try {
      messages = normalizeMessages(body.messages);
    } catch (error) {
      return jsonResponse({ error: error.message }, 400, origin, env);
    }

    if (!messages.some(message => message.role === 'system')) {
      messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages].slice(-MAX_MESSAGES);
    }

    const stream = body.stream !== false;
    const preferredModel = selectModel(body.model, env);
    const fallbackModel = preferredModel === FALLBACK_MODEL ? PRIMARY_MODEL : FALLBACK_MODEL;
    const models = [...new Set([preferredModel, fallbackModel])];

    try {
      const limit = await isRateLimited(env, request);
      if (limit.limited) {
        return jsonResponse(
          { error: limit.scope === 'day' ? '今日免费额度已用完，请明天再试' : '请求过于频繁，请稍后再试' },
          429,
          origin,
          env,
          { 'Retry-After': limit.scope === 'day' ? '3600' : '60' }
        );
      }
    } catch (error) {
      console.error('[rate-limit] failed', error);
      return jsonResponse({ error: 'Rate limit service is unavailable' }, 503, origin, env);
    }

    let lastError;
    for (const model of models) {
      try {
        const result = await runModel(env, model, messages, stream);
        if (stream) {
          const responseStream = result instanceof ReadableStream
            ? result
            : result?.body instanceof ReadableStream
              ? result.body
              : null;
          if (!responseStream) throw new Error('Model did not return a stream');
          return new Response(responseStream, {
            status: 200,
            headers: {
              ...corsHeaders(origin, env),
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache, no-transform',
              'Connection': 'keep-alive',
              'X-Accel-Buffering': 'no'
            }
          });
        }

        const reply = extractReply(result);
        if (!reply) throw new Error('Model returned an empty response');
        return jsonResponse({ reply, model }, 200, origin, env);
      } catch (error) {
        lastError = error;
        console.error(`[workers-ai] model failed: ${model}`, error);
      }
    }

    return jsonResponse(
      { error: '免费 AI 服务暂时不可用，请稍后重试' },
      503,
      origin,
      env,
      lastError ? { 'X-Error-Type': 'model-unavailable' } : {}
    );
  }
};
