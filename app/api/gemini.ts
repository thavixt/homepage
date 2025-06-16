export interface GeminiResponse {
  code: number;
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * error codes:
 * 0: normal - no error
 * 1: query error
 * 2: client error
 * 3: internal server error
 */
export async function askGemini(input: string, context: ChatMessage[]) {
  /* live */
  /**
   * corsproxy.io is used to bypass CORS issues
   * TODO: should use proper CORS handling on the server side
   */
  // const url = import.meta.env.PROD
  //   ? 'https://corsproxy.io/?https://personal.komlosidev.net/api/gemini'
  //   : `/api/gemini`;
  const url = 'https://corsproxy.io/?https://personal.komlosidev.net/api/gemini';

  try {
    const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    const res = await fetch(url, { method: "POST", body: JSON.stringify({text: input, context}), headers});
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