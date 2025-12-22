import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { WeatherWidget } from "~/components/widgets/weatherWidget";
import { Label } from "@radix-ui/react-label";
import { FormDialog } from "~/components/dialogs/formDialog";
import { Input } from "~/components/ui/input";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "~/hooks/state";
import { CurrencyWidget } from "~/components/widgets/currencyWidget";
import { RssWidget } from "~/components/widgets/rssWidget";
import { AiGreetingWidget } from "~/components/widgets/aiGreetingWidget";

export function meta() {
  return [
    { title: "Homepage - Dashboard" },
    { name: "description", content: "Let's put this on a display somewhere" },
  ];
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const currentBackgroundUrl = useAppSelector((state) => state.settings.background.currentUrl);
  // TODO: settings slice end persist, the usual stuff
  const [dialogOpen, setDialogOpen] = useState(false);

  // const queryClient = useQueryClient()
  // const forceRefresh = () => {
  //   queryClient.invalidateQueries({
  //     queryKey: [
  //       'rss-feed',
  //       "ai-greeting",
  //       "weather",
  //       "currency",
  //     ],
  //     refetchType: 'active',
  //   });
  // };

  const requestFullscreen = () => {
    ref.current?.requestFullscreen();
  };

  useEffect(() => {
    const listener = () => {
      if (document.fullscreenElement) {
        if (bgRef.current) {
          bgRef.current.style.display = "block";
        }
      } else {
        if (bgRef.current) {
          bgRef.current.style.display = "none";
        }
      }
    };
    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, [currentBackgroundUrl]);

  const onSubmitSettings = (...args: unknown[]) => {
    console.log("TODO", args);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <FormDialog
            trigger={<Button variant="outline">{t("dashboard.settings.button")}</Button>}
            onSubmit={onSubmitSettings}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Todo"
            description="Todo"
          >
            <div className="grid gap-4 my-4">
              <div className="grid gap-3">
                <Label htmlFor="name">{t("wip")}</Label>
                <Input autoFocus id="name" name="name" />
              </div>
            </div>
          </FormDialog>
          <p className="text-lg">{t("dashboard.title")}</p>
          <div className="flex items-center justify-center gap-2">
            {/* <Button
              variant="outline"
              onClick={() => forceRefresh()}>
              {t("common.refresh")}
            </Button> */}
            <Button onClick={requestFullscreen}>{t("dashboard.fullscreen.button")}</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center text-center">
        <div
          ref={ref}
          id="fullscreenGrid"
          className="grid grid-cols-4 grid-rows-4 gap-12 *:flex *:items-center *:justify-center w-full h-full *:w-full *:h-full"
        >
          <div ref={bgRef} id="fullscreenGridBackground" />

          <RssWidget className="row-span-4 col-span-2 px-4" />
          <CurrencyWidget className="row-span-1 col-span-1" />
          <WeatherWidget slim className="row-span-1 col-span-1" />
          <div className="row-span-2 col-span-2">&nbsp;</div>
          <AiGreetingWidget className="row-span-1 col-span-2 flex gap-2" />
        </div>
      </CardContent>
    </Card>
  );
}
