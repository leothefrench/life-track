export function extractJsonFromResponse(text: string) {
  // La fameuse Regex universelle que nous avons mise au point
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);

  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    return null;
  }
}
