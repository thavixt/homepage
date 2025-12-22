import { askGemini } from "~/api/gemini";
import { getCurrentWeather } from "~/api/weather";

export interface RssItem {
  link: string;
  title: string;
  description: string;
  pubDate: string;
}

export async function getRssFeed(options = {
  // url: "https://telex.hu/rss",
  url: "https://telex.hu/rss/archivum?filters=%7B%22flags%22%3A%5B%22legfontosabb%22%5D%2C%22parentId%22%3A%5B%22null%22%5D%7D&perPage=10",
  count: 4
}): Promise<RssItem[] | null> {
  const rssFeedUrl = `https://corsproxy.io/?${options.url}`;
  try {
    const response = await fetch(rssFeedUrl);
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const items = xmlDoc.querySelectorAll("item");
    const results: RssItem[] = [];
    items.forEach(item => {
      const title = item.querySelector("title")!.textContent;
      const link = item.querySelector("link")!.textContent;
      const description = item.querySelector("description")!.textContent;
      const pubDate = item.querySelector("pubDate")!.textContent;
      results.push({
        title,
        link,
        description,
        pubDate: new Date(pubDate).toLocaleTimeString(),
      })
    });
    return results.slice(0, options.count);
  } catch {
    return null;
  }
}

export async function getAiGreeting(): Promise<string> {
  const { location, current: temp } = await getCurrentWeather();
  const time = new Date().toDateString();
  const template = [
    `It's ${time} in ${location.name}, ${location.country}, the temperature is ${temp.temp_c} °C, with ${temp.condition.text} conditions outside.`,
    "Tell me a relevant, funny greeting to start my day with. Separate sentences with two line breaks. Make it 2 sentences long, and include a single emoji.",
    // "If there's an interesting historical fact about this day, tell me about it."
  ].join("\n");
  const aiGreeting = await askGemini(template);
  return aiGreeting;
}