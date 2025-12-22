
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAiGreeting } from "~/hooks/gemini";
import { cn } from "~/lib/utils";

export function AiGreetingWidget({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { data, isLoading } = useAiGreeting();

  if (!data || isLoading) {
    return <div className={cn("flex flex-col", className)}>
      <LoaderCircle className="animate-spin size-20 opacity-35" />
    </div>
  }

  return (
    <div className={cn("flex flex-col items-center justify-center text-right", className)}>
      {data ? (
        <p className="whitespace-pre-wrap w-full italic px-4">{data}</p>
      ) : (
        <>
          <LoaderCircle className="animate-spin size-14 opacity-35" />
          <p className="whitespace-pre-wrap">{t("common.loading")}</p>
        </>
      )}
    </div>
  )
}