import Link from "next/link";

import { Button } from "@/components/ui/button";
import { feedback as t } from "@/lib/labels";

const NotFoundPage = () => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-20 text-center">
    <h1 className="page-title">{t.notFoundTitle}</h1>
    <p className="text-muted-foreground">{t.notFoundBody}</p>
    <div className="flex flex-wrap justify-center gap-3">
      <Button asChild>
        <Link href="/search">{t.seeShop}</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/">{t.backHome}</Link>
      </Button>
    </div>
  </div>
);

export default NotFoundPage;
