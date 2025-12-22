import { LoaderCircle } from "lucide-react";
import { useRssFeed } from "~/hooks/rss";
import { cn } from "~/lib/utils";

export function RssWidget({ className }: { className?: string }) {
  const { data, isLoading } = useRssFeed()

  if (!data || isLoading) {
    return <div className={cn("flex flex-col", className)}>
      <LoaderCircle className="animate-spin size-20 opacity-35" />
    </div>
  }


  /**
   * TODO some kinda auto scrolling behavour
   * so it scrolls the news in the bottom
   */

  return (
    <div className={cn("w-full max-w-[500px] flex flex-col gap-8", className)}>
      {data ? (
        data.map(item => (
          <div key={item.link}>
            <div className="flex flex-col gap-2 text-left">
              <h2 className="text-xl opacity-75">{item.title}</h2>
              <small className="opacity-50">{item.description}</small>
              <a href={item.link} className="text-xs">{item.pubDate}</a>
            </div>
          </div>
        ))
      ) : (
        <div><LoaderCircle className="animate-spin size-20 opacity-35" /></div>
      )}
    </div>
  )
}