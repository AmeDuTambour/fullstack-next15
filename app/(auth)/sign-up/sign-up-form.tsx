"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpFormDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.actions";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full">
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={signUpFormDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signUpFormDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signUpFormDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmation du mot de passe</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpFormDefaultValues.confirmPassword}
          />
        </div>
        <div>
          <SignUpButton />
          {data && !data.success ? (
            <div className="text-center text-destructive">{data.message}</div>
          ) : null}
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link href="/sign-in" target="_self" className="link underline">
            Connectez-vous
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
