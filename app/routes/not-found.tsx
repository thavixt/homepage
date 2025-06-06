import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Homepage - Oops!" },
    { name: "description", content: "Ummmmm..." },
  ];
}

export default function About() {
  return (
    <Card className="w-[600px]">
      <CardHeader className="w-full text-center font-bold text-8xl">
        <p>404</p>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-6">
        <small>... maybe it's just not fully implemented yet? Check back later!</small>
      </CardContent>
      <CardFooter className="flex items-center justify-center py-6">
        <div>
          <Link viewTransition to="/">Let's just go back <i>home</i> for now.</Link>
        </div>
      </CardFooter>
    </Card>
  );
}
