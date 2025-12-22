import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "Homepage - Oops!" },
    { name: "description", content: "Ummmmm..." },
  ];
}

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <p className="text-8xl">{t('notFound.title')}</p>
        <p className="text-lg">{t('notFound.subtitle')}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-center text-center">
        <small>{t('notFound.description')}</small>
      </CardContent>
      <CardFooter>
        <div>
          <Link viewTransition to="/">{t('notFound.back')}</Link>
        </div>
      </CardFooter>
    </Card>
  );
}
