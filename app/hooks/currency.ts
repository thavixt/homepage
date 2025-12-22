import { useQuery } from "@tanstack/react-query";

export function useCurrencyExchange(currency = "eur") {
  const { data, isPending } = useQuery(
    {
      queryKey: ["currency", currency],
      queryFn: () => getExchangeRates(currency),
      staleTime: 30 * 60 * 1000, // 30min
    }
  );
  return { data, isPending };
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