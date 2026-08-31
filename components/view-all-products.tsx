import Link from "next/link";
import { Button } from "./ui/button";
import { catalog as t } from "@/lib/labels";

const ViewAllProductsButton = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <Button asChild className="px-8 py-4 text-lg font-semibold">
        <Link href="/search">{t.browseShop}</Link>
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
