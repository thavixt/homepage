import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";

export function CurrencyWidget({ className }: { className?: string }) {
  const [currency, _setCurrency] = useState("eur");
  const { data, isLoading } = useQuery(
    {
      queryKey: ["currency"],
      queryFn: () => getExchangeRates(currency),
      staleTime: 30 * 60 * 1000, // 30min
    }
  );

  if (!data || isLoading) {
    return <div className={cn("flex flex-col", className)}>
      <LoaderCircle className="animate-spin size-20 opacity-35" />
    </div>
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="grid grid-cols-2 gap-x-8">
        <div>
          {"Eur/Huf"}
        </div>
        <div className="font-mono text-right">
          {data.eur.huf.toFixed(2)}
        </div>
        <div>
          {"Eur/Usd"}
        </div>
        <div className="font-mono text-right">
          {data.eur.usd.toFixed(2)}
        </div>
        <div>
          {"Eur/Btc"}
        </div>
        <div className="font-mono text-right">
          {data.eur.btc.toFixed(8)}
        </div>
      </div>
    </div>
  )
}

type CurrencyExchangeResponse = {
  [key: string]: CurrencyExchangeRates;
} & {
  date: string; // utc date
};

interface CurrencyExchangeRates {
  [key: string]: number;
}

const getCurrencyApiUrl = (baseCurrency = "huf") => {
  return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`
};

export async function getExchangeRates(baseCurrency = "huf"): Promise<CurrencyExchangeResponse> {
  const res = await fetch(getCurrencyApiUrl(baseCurrency));
  const json = await res.json();
  console.log(json);
  return json;
}