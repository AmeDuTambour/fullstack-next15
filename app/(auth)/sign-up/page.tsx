import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";
import { account as t } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Créer un compte",
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
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
          <CardTitle className="text-center">{t.signUpTitle}</CardTitle>
          <CardDescription className="text-center">
            {t.signUpDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
