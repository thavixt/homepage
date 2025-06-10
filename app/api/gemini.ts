export async function askGemini(input: string) {
  // corsproxy.io is used to bypass CORS issues
  // TODO: should use proper CORS handling on the server side
  const url = `https://corsproxy.io/?https://personal.komlosidev.net/api/gemini`;
  const response = await fetch(url, { method: "POST", body: input});
  const json = await response.text();
  return json;
}
