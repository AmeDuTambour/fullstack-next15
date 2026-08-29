"use client";
import BrandLogo from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotfoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" className="flex-center">
        <BrandLogo variant="square" height={100} priority />
      </Link>
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Page introuvable</h1>
        <p className="text-destructive">La page n&apos;existe pas</p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => (window.location.href = "/")}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotfoundPage;
