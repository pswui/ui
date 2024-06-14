import fetch, {Response} from 'node-fetch'

export async function safeFetch(
  url: string,
): Promise<{ok: true; json: unknown} | {ok: false; message: string; response: Response}> {
  const response = await fetch(url)
  if (response.ok) {
    return {
      ok: true,
      json: await response.json(),
    }
  }

  return {
    ok: false,
    message: `Error while fetching from ${response.url}: ${response.status} ${response.statusText}`,
    response,
  }
}
