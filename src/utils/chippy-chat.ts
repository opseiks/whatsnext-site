import { CHIPPY_SYSTEM_PROMPT } from '../data/chippy-knowledge';

const STOP_NAMES = [
  'Hero', 'Proof', 'Thesis', 'Portfolio',
  'Practice', 'Engage', 'Built With', 'Connect',
];

const STOP_CONTEXT: Record<string, Record<number, string>> = {
  capital: {
    0: 'The visitor just arrived. Ask what they are building.',
    1: 'The visitor is looking at our proof of work. Numbers earned not managed. $1.5B exit, $340M R&D, $2B revenue. Talk about credibility and track record from an investor perspective.',
    2: 'The visitor is reading our investment thesis. Operators make the best investors. Capital without context is noise. Talk about our conviction and what we look for.',
    3: 'The visitor is looking at our portfolio. Talk about the kinds of companies we back and what we look for in founders.',
    4: 'The visitor is looking at our practice areas. Talk about how our operator experience makes us better investors.',
    5: 'The visitor is on the Engage page. We write checks from $50K to $2M. Angel through Series B. Move toward getting them to pitch us.',
    6: 'The visitor is looking at companies we have built with. Talk about the caliber of companies and relationships.',
    7: 'The visitor is on Connect. Close them. Get them to email or book a call.',
  },
  operator: {
    0: 'The visitor just arrived. Ask what they are building and what kind of help they need.',
    1: 'The visitor is looking at our proof of work. $400M+ launched, 20 years in the work. Talk about operator credibility and what we have actually shipped.',
    2: 'The visitor is reading our thesis on games and AI. Talk about where games and AI are going from an operator perspective.',
    3: 'The visitor is looking at our active portfolio. Talk about the kinds of operator problems we are solving and the products we are building.',
    4: 'The visitor is on Practice. Six domains, all shipped. Talk about getting in the work, no PowerPoint consultants, real operator involvement.',
    5: 'The visitor is on Engage. We roll up our sleeves. Fractional, project, or retainer. Move toward getting them to engage with us.',
    6: 'The visitor is looking at companies we have built with. Talk about the depth of these relationships and what we actually did together.',
    7: 'The visitor is on Connect. Close them. Get them to email or book a call.',
  },
};

export async function askChippy(
  question: string,
  mode: string,
  stop: number,
): Promise<string> {
  const contextNote = STOP_CONTEXT[mode]?.[stop]
    || 'Help the visitor understand what W/N does.';

  const contextualSystemPrompt = CHIPPY_SYSTEM_PROMPT + `

CURRENT VISITOR CONTEXT:
The visitor is in ${mode === 'capital' ? 'CAPITAL (investor)' : 'OPERATOR (advisory)'} mode.
They are looking at the ${STOP_NAMES[stop] || 'site'} section.
${contextNote}
Frame your response appropriately for this context.
`;

  try {
    const response = await fetch('/api/chippy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, systemPrompt: contextualSystemPrompt }),
    });

    if (response.status === 429) {
      return 'You have hit the daily limit. Email us at info@whatsnext.digital and we will keep the conversation going.';
    }

    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.answer;
  } catch {
    return 'I am having a moment. Reach us directly at info@whatsnext.digital.';
  }
}
