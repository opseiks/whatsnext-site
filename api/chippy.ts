import type { VercelRequest, VercelResponse } from '@vercel/node';

const RATE_LIMIT = 10;
const rateLimitStore: Record<string, {count: number, date: string}> = {};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]
    || req.socket.remoteAddress
    || 'unknown';

  const today = new Date().toISOString().split('T')[0];

  if (!rateLimitStore[ip] || rateLimitStore[ip].date !== today) {
    rateLimitStore[ip] = { count: 0, date: today };
  }

  rateLimitStore[ip].count++;

  if (rateLimitStore[ip].count > RATE_LIMIT) {
    return res.status(429).json({
      error: 'Daily limit reached. Email us at info@whatsnext.digital.',
    });
  }

  const { question, systemPrompt } = req.body;

  if (!question || !systemPrompt) {
    return res.status(400).json({ error: 'Missing question or systemPrompt' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 256,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }],
      }),
    });

    if (!response.ok) throw new Error('Anthropic API error');
    const data = await response.json();
    return res.status(200).json({ answer: data.content[0].text });
  } catch {
    return res.status(500).json({
      error: 'I am having a moment. Reach us at info@whatsnext.digital.',
    });
  }
}
