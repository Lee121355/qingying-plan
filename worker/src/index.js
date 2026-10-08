const DEFAULT_ALLOWED_ORIGINS = [
  'https://lee121355.github.io',
  'http://localhost',
  'http://127.0.0.1'
];
const LOCAL_ORIGIN_PATTERN = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;
const PRIMARY_MODEL = 'deepseek-flash';
const FALLBACK_MODEL = 'deepseek-chat';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_TIMEOUT_MS = 60000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_OUTPUT_TOKENS = 1024;
const MINUTE_LIMIT = 10;
const DAY_LIMIT = 100;
const KV_MINUTE_TTL = 60;
const KV_DAY_TTL = 86400;
const MEMORY_LIMIT_STORE = new Map();

const SYSTEM_PROMPT = `
你是“轻盈计划”的健康管理 AI 助手。
你的职责是帮助用户制定饮食、训练、睡眠和健康计划。

必须遵守：
1. 无论用户用什么语言提问，你都必须使用简体中文回答。
2. 回答要简洁、友好、实用，避免冗长废话。
3. 涉及饮食和训练建议时，尽量给出具体数字、步骤和注意事项。
4. 涉及健康风险时，提醒用户咨询专业医生。
5. 不要输出英文段落，专有名词（如 BMI、HIIT）可保留英文，但正文必须是中文。
6. 当回复中包含可直接加入饮食计划的具体食谱时，在 Markdown 正文末尾附加一个 \`\`\`json 代码块，内容格式为：{"suggestions":[{"meal":"早餐/午餐/晚餐/加餐","name":"菜名","calories":数字,"grams":数字,"protein":数字,"carbs":数字,"fat":数字}]}。
7. 只有在信息充分、食谱可直接执行时才输出建议块；没有具体食谱时输出 {"suggestions":[]}。JSON 块只用于网页添加计划，不要在正文中解释或引用。
`;

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
  const primary = String(env.DEEPSEEK_MODEL || PRIMARY_MODEL).trim() || PRIMARY_MODEL;
  const fallback = String(env.DEEPSEEK_FALLBACK_MODEL || FALLBACK_MODEL).trim() || FALLBACK_MODEL;
  const models = [primary, fallback];
  if (models.includes(requested)) return requested;
  return primary;
}

async function callDeepSeek(env, model, messages, stream) {
  if (!env.DEEPSEEK_API_KEY) {
    const error = new Error('DeepSeek API Key 尚未配置');
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': stream ? 'text/event-stream' : 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
        temperature: 0.7,
        max_tokens: MAX_OUTPUT_TOKENS
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const error = new Error(`DeepSeek API 请求失败（${response.status}）`);
      error.status = response.status;
      throw error;
    }
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

function mapDeepSeekError(error) {
  if (error?.code === 'MISSING_API_KEY' || error?.status === 401) {
    return { status: 503, message: 'AI 服务密钥无效或尚未配置，请联系管理员' };
  }
  if (error?.status === 402) {
    return { status: 402, message: 'AI 服务余额不足，请稍后再试或联系管理员' };
  }
  if (error?.status === 429) {
    return { status: 429, message: 'AI 服务请求过于频繁，请稍后再试' };
  }
  if (error?.name === 'AbortError') {
    return { status: 504, message: 'AI 服务响应超时，请稍后重试' };
  }
  return { status: 502, message: 'AI 服务暂时不可用，请稍后重试' };
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
      return jsonResponse({ error: '请求来源不受支持' }, 403, origin, env);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }

    if (pathname !== '/api/chat') {
      return jsonResponse({ error: '接口不存在' }, 404, origin, env);
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: '请求方法不受支持' }, 405, origin, env, { Allow: 'POST, OPTIONS' });
    }
    if (!env.DEEPSEEK_API_KEY) {
      return jsonResponse({ error: 'AI 服务密钥尚未配置，请联系管理员' }, 503, origin, env);
    }

    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > 100000) {
      return jsonResponse({ error: '请求内容过大' }, 413, origin, env);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: '请求内容格式不正确' }, 400, origin, env);
    }

    let messages;
    try {
      messages = normalizeMessages(body.messages);
    } catch (error) {
      return jsonResponse({ error: error.message }, 400, origin, env);
    }

    const conversationMessages = messages.filter(message => message.role !== 'system');
    messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationMessages.slice(-(MAX_MESSAGES - 1))
    ];

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
      return jsonResponse({ error: '限流服务暂时不可用，请稍后重试' }, 503, origin, env);
    }

    let lastError;
    for (const model of models) {
      try {
        const response = await callDeepSeek(env, model, messages, stream);

        if (stream) {
          if (!response.body) throw new Error('DeepSeek 未返回流式响应');
          return new Response(response.body, {
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

        const result = await response.json();
        const reply = extractReply(result);
        if (!reply) throw new Error('DeepSeek 返回了空内容');
        return jsonResponse({ reply, model }, 200, origin, env);
      } catch (error) {
        lastError = error;
        console.error(`[deepseek] model failed: ${model}`, error);
        if ([401, 402, 429].includes(error?.status) || error?.code === 'MISSING_API_KEY' || error?.name === 'AbortError') break;
      }
    }

    const mapped = mapDeepSeekError(lastError);
    return jsonResponse({ error: mapped.message }, mapped.status, origin, env);
  }
};
