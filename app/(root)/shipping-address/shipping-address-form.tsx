"use client";

import { PendingButton } from "@/components/ui/pending-button";
import { common, order as t } from "@/lib/labels";
import { useToast } from "@/hooks/use-toast";
import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  SHIPPING_COUNTRIES,
  shippingAddressDefaultValues,
} from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";

type ShippingAddressFormProps = {
  address: ShippingAddress;
};

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  address,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      router.push("/payment-method");
    });
    return;
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="page-title mt-4">{t.shippingAddress}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.fullName}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder={t.fullNamePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.streetAddress}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="street-address"
                    placeholder={t.streetAddressPlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Code postal et ville forment une seule information postale : les
              séparer sur deux lignes pleine largeur allongeait le formulaire
              sans rien clarifier. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[8rem_1fr]">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.postalCode}</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder={t.postalCodePlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.city}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="address-level2"
                      placeholder={t.cityPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.country}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.countryPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SHIPPING_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <PendingButton
            type="submit"
            pending={isPending}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            {common.next}
          </PendingButton>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;
