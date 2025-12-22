import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRef, useState } from "react";
import { WeatherWidget } from "~/components/widgets/weatherWidget";
import { Label } from "@radix-ui/react-label";
import { FormDialog } from "~/components/dialogs/formDialog";
import { Input } from "~/components/ui/input";
import { useTranslation } from "react-i18next";
import { CurrencyWidget } from "~/components/widgets/currencyWidget";
import { RssWidget } from "~/components/widgets/rssWidget";
import { ClockWidget } from "~/components/widgets/ClockWidget";

export function meta() {
  return [
    { title: "Homepage - Dashboard" },
    { name: "description", content: "Let's put this on a display somewhere" },
  ];
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  // TODO: settings slice end persist, the usual stuff
  const [dialogOpen, setDialogOpen] = useState(false);

  const requestFullscreen = () => {
    ref.current?.requestFullscreen();
  };

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
            <Button onClick={requestFullscreen}>{t("dashboard.fullscreen.button")}</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center text-center">
        <div
          ref={ref}
          id="fullscreenDashboard"
          className="w-full h-full grid grid-cols-4 grid-rows-4 gap-12 *:flex *:items-center *:justify-center *:w-full *:h-full"
        >
          <CurrencyWidget className="row-span-1 col-span-1" />
          <ClockWidget className="row-span-1 col-span-2 px-4" />
          <WeatherWidget slim className="row-span-1 col-span-1" />
          <div className="row-span-1 col-span-4" />
          <RssWidget className="row-span-2 col-span-2" />
        </div>
      </CardContent>
    </Card>
  );
}
