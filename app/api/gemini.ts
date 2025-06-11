export interface GeminiResponse {
  code: number;
  text: string;
}

/**
 * error codes:
 * 0: normal - no error
 * 1: query error
 * 2: client error
 * 3: internal server error
 */

export async function askGemini(input: string) {
  // corsproxy.io is used to bypass CORS issues
  // TODO: should use proper CORS handling on the server side
  const url = `https://corsproxy.io/?https://personal.komlosidev.net/api/gemini`;

  try {
    const res = await fetch(url, { method: "POST", body: input});
    const response = await res.json() as GeminiResponse;

    if (response.code !== 0) {
      throw new Error(response.text, { cause: response.code });
    }
    return response.text;
  } catch (e) {
    console.error(e);
    throw (e as Error);
  }
}