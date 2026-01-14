import { RotatingText } from "~/components/ui/rotating-text";
import { LoaderCircle } from "lucide-react";
import { useRssFeed } from "~/hooks/rss";
import { cn } from "~/lib/utils";

const TEXT_SLIDE_MS = 10 * 1000;

export function RssWidget({ className, rssUrl }: { className?: string; rssUrl: string }) {
  const { data, isLoading } = useRssFeed({ url: rssUrl })

  if (!data || isLoading) {
    return <div className={cn("flex flex-col", className)}>
      <LoaderCircle className="animate-spin size-20 opacity-50" />
    </div>
  }

  const titles = data.map(article => article.title);
  const descriptions = data.map(article => `${article.description}`);

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-end! gap-2 p-8", className)}>
      <RotatingText
        text={titles}
        style={{ fontWeight: "bold" }}
        duration={TEXT_SLIDE_MS}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <RotatingText
        style={{ fontStyle: "italic" }}
        text={descriptions}
        duration={TEXT_SLIDE_MS}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  )
}