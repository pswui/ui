export async function jaroWinkler(a: string, b: string): Promise<number> {
  const p = 0.1

  if (!a.length || !b.length) return 0.0
  if (a === b) return 1.0

  const range = Math.floor(Math.max(a.length, b.length) / 2) - 1
  let matches = 0

  let aMatches = new Array(a.length)
  let bMatches = new Array(b.length)

  for (let i = 0; i < a.length; i++) {
    const start = i >= range ? i - range : 0
    const end = i + range <= b.length - 1 ? i + range : b.length - 1

    for (let j = start; j <= end; j++) {
      if (bMatches[j] !== true && a[i] === b[j]) {
        ++matches
        aMatches[i] = bMatches[j] = true
        break
      }
    }
  }

  if (matches === 0) return 0.0

  let t = 0

  let point: number

  for (point = 0; point < a.length; point++) if (aMatches[point]) break

  for (let i = point; i < a.length; i++)
    if (aMatches[i]) {
      let j
      for (j = point; j < b.length; j++)
        if (bMatches[j]) {
          point = j + 1
          break
        }

      if (a[i] !== b[j]) ++t
    }

  t = t / 2.0

  const J = (matches / a.length + matches / b.length + (matches - t) / matches) / 3
  return J + Math.min((p * t) / matches, 1) * (1 - J)
}

export async function getSuggestion(componentNames: string[], input: string): Promise<string[]> {
  const componentJw = await Promise.all(
    componentNames.map(async (name) => [name, await jaroWinkler(name, input)] as const),
  )
  return componentJw
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name)
}
