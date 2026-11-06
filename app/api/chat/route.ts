import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      baseUrl,
      apiKey,
      model,
      messages,
      temperature,
      maxTokens,
      stream = true,
    } = body || {};

    if (!baseUrl || !model || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Некорректные параметры запроса' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = `${String(baseUrl).replace(/\/+$/, '')}/chat/completions`;

    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (stream && upstream.body) {
      return new Response(upstream.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    const json = await upstream.json();
    return Response.json(json);
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Ошибка прокси' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
