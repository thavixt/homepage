import { getApiRequestUrl } from "./utils";

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
  try {
    const res = await fetch(
      getApiRequestUrl('gemini'),
      {
        method: "POST", body: JSON.stringify({ text: input, context }),
      },
    );
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