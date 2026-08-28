"use client";

import { useActionState } from "react";
import { account as t, common as t2 } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInFormDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full">
        {pending ? t.signingIn : t.signIn}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">{t2.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInFormDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">{t2.password}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInFormDefaultValues.password}
          />
        </div>
        <div>
          <SignInButton />
          {data && !data.success ? (
            <div className="text-center text-destructive">{data.message}</div>
          ) : null}
        </div>
        <div className="text-sm text-center text-muted-foreground">
          {t.noAccount}{" "}
          <Link href="/sign-up" target="_self" className="link underline">
            {t.goSignUp}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
