import fetch, {Response} from 'node-fetch'

export async function safeFetch(
  url: string,
): Promise<{message: string; ok: false; response: Response} | {ok: true; response: Response}> {
  const response = await fetch(url)
  if (response.ok) {
    return {
      ok: true,
      response,
    }
  }

  return {
    message: `Error while fetching from ${response.url}: ${response.status} ${response.statusText}`,
    ok: false,
    response,
  }
}
