"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const NotfoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" className="flex-center">
        <Image
          src="/images/brand/logo-square-light.png"
          alt={`${APP_NAME} logo`}
          className="object-contain dark:hidden"
          priority={true}
          height={100}
          width={100}
        />
        <Image
          src="/images/brand/logo-square-dark.png"
          alt={`${APP_NAME} logo`}
          className="object-contain hidden dark:block"
          priority={true}
          height={100}
          width={100}
        />
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
