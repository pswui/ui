export async function jaroWinkler(a: string, b: string): Promise<number> {
  const p = 0.1;

  if (a.length === 0 || b.length === 0) return 0;
  if (a === b) return 1;

  const range = Math.floor(Math.max(a.length, b.length) / 2) - 1;
  let matches = 0;

  const aMatches = Array.from({ length: a.length });
  const bMatches = Array.from({ length: b.length });

  for (const [i, element] of Object.entries(a).map(
    ([index, element]) => [Number.parseInt(index, 10), element] as const,
  )) {
    const start = i >= range ? i - range : 0;
    const end = i + range <= b.length - 1 ? i + range : b.length - 1;

    for (let j = start; j <= end; j++) {
      if (bMatches[j] !== true && element === b[j]) {
        ++matches;
        aMatches[i] = true;
        bMatches[j] = true;
        break;
      }
    }
  }

  if (matches === 0) return 0;

  let t = 0;

  let point: number;

  for (point = 0; point < a.length; point++) if (aMatches[point]) break;

  for (let i = point; i < a.length; i++)
    if (aMatches[i]) {
      let j: number;
      for (j = point; j < b.length; j++)
        if (bMatches[j]) {
          point = j + 1;
          break;
        }

      if (a[i] !== b[j]) ++t;
    }

  t /= 2;

  const J =
    (matches / a.length + matches / b.length + (matches - t) / matches) / 3;
  return J + Math.min((p * t) / matches, 1) * (1 - J);
}

export async function getSuggestion(
  componentNames: string[],
  input: string,
): Promise<string[]> {
  const componentJw = await Promise.all(
    componentNames.map(
      async (name) => [name, await jaroWinkler(name, input)] as const,
    ),
  );
  return componentJw
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}
