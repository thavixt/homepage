
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAiGreeting } from "~/lib/request";
import { cn } from "~/lib/utils";

export function AiGreetingWidget({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(
    {
      queryKey: ["ai-greeting"],
      queryFn: () => getAiGreeting(),
      staleTime: 30 * 60 * 1000, // 60min
    }
  );

  if (!data || isLoading) {
    return <div className={cn("flex flex-col", className)}>
      <LoaderCircle className="animate-spin size-20 opacity-35" />
    </div>
  }

  return (
    <div className={cn("flex flex-col items-center justify-center text-right", className)}>
      {data ? (
        <p className="whitespace-pre-wrap w-full max-w-[500px] italic">{data}</p>
      ) : (
        <>
          <LoaderCircle className="animate-spin size-14 opacity-35" />
          <p className="whitespace-pre-wrap">{t("common.loading")}</p>
        </>
      )}
    </div>
  )
}