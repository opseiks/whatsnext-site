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

const IN_APP_BROWSER_PATTERNS: RegExp[] = [
  /LinkedInApp/i,
  /Instagram/i,
  /FBAN/i,
  /FBAV/i,
  /Twitter/i,
  /Line\//i,
];

export function isBot(
  ua: string | undefined = typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
): boolean {
  if (!ua) return false;
  return BOT_PATTERNS.some((p) => p.test(ua));
}

export function isInAppBrowser(
  ua: string | undefined = typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
): boolean {
  if (!ua) return false;
  return IN_APP_BROWSER_PATTERNS.some((p) => p.test(ua));
}
