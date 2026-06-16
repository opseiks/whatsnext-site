export async function askChippy(
  question: string,
  systemPrompt: string,
): Promise<string> {
  try {
    const response = await fetch('/api/chippy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, systemPrompt }),
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
