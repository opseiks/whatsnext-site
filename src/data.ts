import type {
  BillboardStat, ThesisEntry, PortfolioDomain,
  PracticeItem, EngageStep, BuiltItem, PanelCopy, Mode, Stop
} from './types';

export const STOP_NAMES = ['Hero', 'Proof', 'Thesis', 'Portfolio', 'Practice', 'Engage', 'Built With', 'Connect'];
export const MAX_STOP: Stop = 7;

export const CHIPS: Record<Mode, string[]> = {
  neutral: ['assets/chip-question-f.png', 'assets/chip-2b-f.png', 'assets/chip-400-f.png', 'assets/chip-wnd-f.png'],
  capital: ['assets/chip-2b-f.png', 'assets/chip-wnd-f.png', 'assets/chip-400-f.png', 'assets/chip-20yrs-f.png'],
  operator: ['assets/chip-400-f.png', 'assets/chip-20yrs-f.png', 'assets/chip-wnd-f.png', 'assets/chip-2b-f.png'],
};

export const TURNS = [
  'assets/chip-wnd-f.png',
  'assets/chip-wnd-turn1.png',
  'assets/chip-wnd-turn2.png',
  'assets/chip-wnd-turn3.png',
];

export const PANEL_TAGS = [
  'CHIPPY · 00 HERO',
  'CHIPPY · 01 PROOF',
  'CHIPPY · 02 THESIS',
  'CHIPPY · 03 PORTFOLIO',
  'CHIPPY · 04 PRACTICE',
  'CHIPPY · 05 ENGAGE',
  'CHIPPY · 06 BUILT WITH',
  'CHIPPY · 07 CONNECT',
];

export const BB: Record<'capital' | 'operator', BillboardStat[]> = {
  capital: [
    { val: '$1.5B', num: 1.5, pre: '$', suf: 'B', dec: 1, lbl: 'The Exit', desc: 'WMS Gaming → Scientific Games. Co-stewarded by our team.', chip: 'assets/chip-2b-f.png' },
    { val: '20YRS', num: 20, pre: '', suf: 'YRS', dec: 0, lbl: 'In the Work', desc: 'Games, marketing & platforms — console, mobile, social, live.', chip: 'assets/chip-20yrs-f.png' },
    { val: '$340M', num: 340, pre: '$', suf: 'M', dec: 0, lbl: 'R&D Directed', desc: 'Annual portfolios at multi-billion-dollar scale.', chip: 'assets/chip-wnd-f.png' },
    { val: '7+', num: 7, pre: '', suf: '+', dec: 0, lbl: 'Portfolio Active', desc: 'Companies in games, AI, AR & creator infrastructure.', chip: 'assets/chip-400-f.png' },
  ],
  operator: [
    { val: '$1.5B', num: 1.5, pre: '$', suf: 'B', dec: 1, lbl: 'Exit on Record', desc: 'WMS Gaming → Scientific Games. Real money, real exit.', chip: 'assets/chip-2b-f.png' },
    { val: '20YRS', num: 20, pre: '', suf: 'YRS', dec: 0, lbl: 'Time in Domain', desc: 'Console, mobile, social & live ops. Not a tourist.', chip: 'assets/chip-20yrs-f.png' },
    { val: '$400M+', num: 400, pre: '$', suf: 'M+', dec: 0, lbl: 'Launched & Shipped', desc: 'Products from concept to global scale — hands on.', chip: 'assets/chip-400-f.png' },
    { val: '$340M', num: 340, pre: '$', suf: 'M', dec: 0, lbl: 'Active Portfolio', desc: 'Games, AI & AR — still operating, not just advising.', chip: 'assets/chip-wnd-f.png' },
  ],
};

export const GHOST_NUM: Record<Mode, string> = {
  capital: '$1.5B',
  operator: '$400M',
  neutral: '',
};

export const THESIS: Record<'capital' | 'operator', ThesisEntry[]> = {
  capital: [
    { key: 'Operators', stmt: 'Operators make the best investors. <em class="it">Capital without context is just noise.</em>', sub: 'Every check we write, we\'ve run that play.' },
    { key: 'Technology', stmt: 'Technology should serve humans. <em class="it">Not the other way around.</em>', sub: 'We back products that amplify people, not replace them.' },
    { key: 'Games', stmt: 'The next wave in games isn\'t a new genre. <em class="it">It\'s a new surface.</em>', sub: 'Mobile rewrote the market once. AI and AR will do it again.' },
    { key: 'AI', stmt: 'AI is the most powerful platform shift since mobile. <em class="it">Most companies will miss it.</em>', sub: 'We won\'t.' },
  ],
  operator: [
    { key: 'People', stmt: 'If you can\'t get others to see it, it doesn\'t matter.', sub: 'Seeing what others miss is the gift. Getting others to see it — that\'s the work.' },
    { key: 'Process', stmt: 'Without a repeatable process you cannot deliver your vision.', sub: 'Stage gates, waterfall, sprints. All of them — at the right time.' },
    { key: 'Product', stmt: 'People, process, product. In that order. Always.', sub: 'Every breakdown I\'ve seen came from skipping one of the three.' },
    { key: 'Proof', stmt: 'Breakthroughs don\'t happen in isolation. They compound.', sub: 'Advertising → games → casino → AI. Each one is the foundation for the next.' },
  ],
};

export const DOMAINS: PortfolioDomain[] = [
  { tag: 'AI · MULTI-AGENT · NEW 2026', name: 'AI Social Simulator', desc: 'Investment · Stealth · Multi-AI social physics simulation platform.', bg: '#081410', video: 'assets/portfolio/portfolio-ai-social.mp4' },
  { tag: 'AI · ENGAGEMENT', name: 'Agentic Player-Support Stack', desc: 'Advisory · Autonomous player support & live ops intelligence.', bg: '#0c1608', video: 'assets/portfolio/portfolio-ai-engagement.mp4' },
  { tag: 'GAMING · REAL MONEY', name: 'Real Money Gaming', desc: 'Land-based + iGaming · Advisory · Operator intelligence & platforms.', bg: '#0f0a06', video: 'assets/portfolio/portfolio-real-money.mp4' },
  { tag: 'GAMES · AAA', name: 'Live Service Action RPG', desc: 'Product advisory · Stealth · Pre-launch 2024+', bg: '#0c0c14', video: 'assets/portfolio/portfolio-aaa-rpg.mp4' },
  { tag: 'GAMES · DIGITAL', name: 'Social & Web3 Gaming', desc: 'Investment + Product advisory · 2024+', bg: '#090f0c', video: 'assets/portfolio/portfolio-web3.mp4' },
  { tag: 'GAMES · CASUAL', name: 'Hybrid Casual Studio', desc: 'Investment + Prod Strategy · 2024+', bg: '#0b1008', video: 'assets/portfolio/portfolio-casual.mp4' },
];

export const PRACTICE: PracticeItem[] = [
  { num: '01', name: 'Future Impacting', em: 'Investments' },
  { num: '02', name: 'Corporate Product', em: 'Strategy' },
  { num: '03', name: 'Game Design &', em: 'Live Ops' },
  { num: '04', name: 'Agentic', em: 'Transformation' },
  { num: '05', name: 'Go-To-Market', em: '& Growth' },
  { num: '06', name: 'Community &', em: 'Creator Stacks' },
];

export const ENGAGE: Record<'capital' | 'operator', EngageStep[]> = {
  capital: [
    { num: '01', name: 'Pitch us', desc: '15-minute founder call. No deck required. We move fast.' },
    { num: '02', name: 'Operator review', desc: 'We spend real time in your product before any check. Real diligence.' },
    { num: '03', name: 'Term sheet', desc: 'Simple, operator-friendly terms. We\'ve been on your side of the table.' },
  ],
  operator: [
    { num: '01', name: 'Fractional', desc: 'Embedded with your team. Weekly cadence. Real work, ongoing.' },
    { num: '02', name: 'Project', desc: 'Defined scope, defined outcome. We get in, we deliver, we leave.' },
    { num: '03', name: 'Retainer', desc: 'Standing advisory. Senior access when you need it, not just quarterly.' },
  ],
};

export const BUILT: BuiltItem[] = [
  { name: 'WMS Gaming → Scientific Games', note: '$1.5B exit · co-stewarded', hero: true },
  { name: 'Scientific Games', note: 'Post-acquisition operations' },
  { name: 'Advertising & broadcast', note: '40+ brands · awards won' },
  { name: 'Casino gaming platforms', note: 'Land-based + iGaming · advisory' },
  { name: 'Mobile & social game studios', note: '$400M+ launched · concept → scale' },
  { name: 'AI + AR product companies', note: 'Active portfolio · stealth' },
];

export const PARTNERS = [
  'Respawn Entertainment', 'Nexon', 'Avalanche Studios', 'Aristocrat',
  'Scientific Games', 'WMS Gaming', 'Xbox Game Studios', 'Aruze Gaming Global',
  'Burn Ghost', 'Joingo', 'PlayBeMo', '+ more',
];

export const PCOPY: Record<Mode, PanelCopy[]> = {
  neutral: Array(8).fill({ h: 'First — <span class="aword">what brings you in?</span>', choices: true }),
  capital: [
    { h: 'You\'re raising. <span class="aword">Here\'s how we move.</span>', b: ['Pre-seed through Series B. Checks $250K–$2M.', 'We only back what we\'d build ourselves.', 'Operator diligence before a term sheet.'], s: '$1.5B exit · WMS → Scientific Games' },
    { h: 'Proof you can <span class="aword">underwrite.</span>', b: ['A real exit — $1.5B, not a projection.', 'Twenty years of P&L. Not a pitch deck.', 'We\'ve already sat on your side of the table.'], s: '$1.5B exit · co-stewarded with the team' },
    { h: 'Our investment <span class="aword">thesis.</span>', b: ['Operators write the best checks.', 'Technology in service of humans.', 'The next surface, not the next genre.'], s: 'Four principles · non-negotiable' },
    { h: 'The portfolio <span class="aword">thesis.</span>', b: ['$340M deployed across four domains.', 'Every domain we\'ve operated in first.', 'We don\'t invest where we haven\'t shipped.'], s: '$340M active · games · AI · AR' },
    { h: 'Where we invest and advise. <span class="aword">Hands on.</span>', b: ['Active checks plus operator involvement.', 'We don\'t just wire money — we work.', 'Six domains, all have been our day job.'], s: 'Six practice areas · operator-led' },
    { h: 'We invest time <span class="aword">before capital.</span>', b: ['15-minute call. No deck required.', 'We get close to the work first.', 'Senior operator attention at every stage.'], s: 'Pre-seed → Series B · $250K–$2M' },
    { h: 'Names that <span class="aword">verify.</span>', b: ['$1.5B exit co-stewarded. Not managed.', 'WMS → Scientific Games. Real money.', '40+ brands in advertising + broadcast.'], s: '$1.5B exit · WMS → Scientific Games' },
    { h: 'Ready to <span class="aword">move?</span>', b: ['We answer every email. Same day.', 'Pre-seed through Series B. $250K–$2M.', 'We only back what we\'d build ourselves.'], s: 'info@whatsnext.digital · 2-day response' },
  ],
  operator: [
    { h: 'You need an operator. <span class="aword">Here\'s the work.</span>', b: ['Fractional, project, or retainer — sleeves up.', 'Product, game design, live ops, GTM, AI.', 'Senior attention most firms charge fund fees for.'], s: '$400M+ launched · concept → scale' },
    { h: 'Proof we\'ve <span class="aword">done the work.</span>', b: ['$400M+ launched — concept to scale.', 'Live ops across console, mobile and social.', 'Scars included. Ask about the ones that taught us most.'], s: '$340M active · games · AI · AR' },
    { h: 'Our operating <span class="aword">thesis.</span>', b: ['People lead. Process delivers. Product proves.', 'See it. Get others to see it. Ship it.', 'Every domain compounds into the next.'], s: 'Three principles · earned not invented' },
    { h: 'Where we\'ve <span class="aword">operated.</span>', b: ['We only work in domains we\'ve shipped in.', 'Not advisors. Operators with skin in it.', 'The portfolio reflects the battle scars.'], s: 'Four domains · all hands-on' },
    { h: 'Six domains. All of them <span class="aword">shipped.</span>', b: ['These aren\'t services — they\'re scars.', 'Pick a domain and we\'ll talk about what we\'ve actually done.', 'No PowerPoint consultants.'], s: '$400M+ across all six · concept → scale' },
    { h: 'We work with you <span class="aword">before we advise.</span>', b: ['Embedded, not advisory. Real work.', 'Fractional, project, or retainer.', 'Senior attention most firms charge fund fees for.'], s: '$400M+ launched · concept → scale' },
    { h: 'Places we\'ve <span class="aword">shipped.</span>', b: ['Console, mobile, social, live ops.', 'Not advisors. Operators with skin in it.', 'The scars are the resume.'], s: '$400M+ across all domains · hands-on' },
    { h: 'Building what <span class="aword">shouldn\'t exist yet?</span>', b: ['Tell us what you\'re working on.', 'Early stage or in market — doesn\'t matter.', 'We get back inside two business days.'], s: 'Betting on people building what\'s next.' },
  ],
};
