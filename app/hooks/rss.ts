import { useQuery } from "@tanstack/react-query";

export function useRssFeed({ url }: { url: string }) {
  const { data, isLoading } = useQuery(
    {
      queryKey: ["rss-feed", url],
      queryFn: () => getRssFeed({ url }),
      staleTime: 5 * 60 * 1000, // 5min
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

export async function getRssFeed({ url }: {
  url: string,
}): Promise<RssItem[]> {
  const rssFeedUrl = `https://corsproxy.io/?${url}`;
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
    return results;
  } catch {
    return [];
  }
}