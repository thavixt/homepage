import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Homepage - About" },
    { name: "description", content: "Some info about this Homepage site" },
  ];
}

export default function AboutPage() {
  return (
     <Card className=" backdrop-blur-lg w-[500px]">
      <CardHeader className="w-full text-center font-bold text-4xl">
        About this page
      </CardHeader>
      <CardContent>
        TODO
      </CardContent>
    </Card>
  );
}
