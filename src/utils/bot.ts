const BOT_PATTERNS: RegExp[] = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebot/i,
  /facebookexternalhit/i,
  /ia_archiver/i,
  /linkedinbot/i,
  /twitterbot/i,
  /chatgpt-user/i,
];

export function isBot(
  ua: string | undefined = typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
): boolean {
  if (!ua) return false;
  return BOT_PATTERNS.some((p) => p.test(ua));
}
