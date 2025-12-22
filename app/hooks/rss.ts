import { useQuery } from "@tanstack/react-query";

export function useRssFeed() {
  const { data, isLoading } = useQuery(
    {
      queryKey: ["rss-feed"],
      queryFn: () => getRssFeed(),
      staleTime: 10 * 60 * 1000, // 10min
    }
  );

  return { data, isLoading };
}

export interface RssItem {
  link: string;
  title: string;
  description: string;
  pubDate: string;
}

/**
 * @TODO this should be configurable
 */

export async function getRssFeed(options = {
  // url: "https://telex.hu/rss",
  url: "https://telex.hu/rss/archivum?filters=%7B%22flags%22%3A%5B%22legfontosabb%22%5D%2C%22parentId%22%3A%5B%22null%22%5D%7D&perPage=10",
  count: 3
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