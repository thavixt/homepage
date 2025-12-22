import { LoaderCircle } from "lucide-react";
import { useCurrencyExchange } from "~/hooks/currency";
import { cn } from "~/lib/utils";

/**
 * @todo settings for currency exchange grid
 */

export function CurrencyWidget({ className }: { className?: string }) {
  const { data, isPending } = useCurrencyExchange("eur");

  if (!data || isPending) {
    return <div className={cn("flex flex-col", className)}>
      <LoaderCircle className="animate-spin size-20 opacity-35" />
    </div>
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="grid grid-cols-2 gap-x-8 font-mono">
        <div>
          {"eur/huf"}
        </div>
        <div className="text-right">
          {data.eur.huf.toFixed(2)}
        </div>
        <div>
          {"eur/usd"}
        </div>
        <div className="text-right">
          {data.eur.usd.toFixed(2)}
        </div>
        <div>
          {"eur/btc"}
        </div>
        <div className="text-right">
          {data.eur.btc.toFixed(8)}
        </div>
      </div>
    </div>
  )
}
