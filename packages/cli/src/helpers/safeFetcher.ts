import fetch, {Response} from 'node-fetch'

export async function safeFetch(
  url: string,
): Promise<{ok: true; response: Response} | {ok: false; message: string; response: Response}> {
  const response = await fetch(url)
  if (response.ok) {
    return {
      ok: true,
      response,
    }
  }

  return {
    ok: false,
    message: `Error while fetching from ${response.url}: ${response.status} ${response.statusText}`,
    response,
  }
}
