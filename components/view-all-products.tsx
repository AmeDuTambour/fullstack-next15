import Link from "next/link";
import { Button } from "./ui/button";

const ViewAllProductsButton = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <Button asChild className="px-8 py-4 text-lg font-semibold">
        <Link href="/search">Découvrir tous les produits</Link>
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
