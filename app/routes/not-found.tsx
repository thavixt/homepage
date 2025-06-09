import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Link } from "react-router";
import { useTypesafeTranslation } from "~/i18n";

export function meta() {
  return [
    { title: "Homepage - Oops!" },
    { name: "description", content: "Ummmmm..." },
  ];
}

export default function NotFoundPage() {
  const t = useTypesafeTranslation();

  return (
     <Card className=" backdrop-blur-lg w-[600px]">
      <CardHeader className="w-full text-center font-bold">
        <p className="text-8xl">{t('404.title')}</p>
        <p className="text-lg">{t('404.subtitle')}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-6">
        <small>{t('404.description')}</small>
      </CardContent>
      <CardFooter className="flex items-center justify-center py-6">
        <div>
          <Link viewTransition to="/">{t('404.back')}</Link>
        </div>
      </CardFooter>
    </Card>
  );
}
