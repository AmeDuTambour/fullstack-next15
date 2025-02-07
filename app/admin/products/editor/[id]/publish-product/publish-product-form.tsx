"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { productBaseDefaultValue } from "@/lib/constants";
import { baseProductSchema, insertArticleSchema } from "@/lib/validators";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowBigLeft, Home } from "lucide-react";
import { updateBaseProduct } from "@/lib/actions/product.actions";

type PublishProductFormProps = {
  product?: Product;
};

const PublishProductForm: React.FC<PublishProductFormProps> = ({ product }) => {
  if (!product) notFound();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof baseProductSchema>>({
    resolver: zodResolver(baseProductSchema),
    defaultValues: product
      ? { ...product }
      : {
          ...productBaseDefaultValue,
        },
  });

  // const isPublished = form.watch("isPublished");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  const onSubmit: SubmitHandler<z.infer<typeof baseProductSchema>> = async (
    values
  ) => {
    const res = await updateBaseProduct({ ...values, id: product.id });
    if (!res.success) {
      toast({ variant: "destructive", description: res.message });
    } else {
      toast({ description: res.message });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="updload-field">
            <div className="flex flex-row gap-8">
              <h2 className="font-bold mb-2 text-lg">Feature Product</h2>

              <FormField
                control={form.control}
                name="isFeatured"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof insertArticleSchema>,
                    "isFeatured"
                  >;
                }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isFeatured ? (
              <div className="flex flex-col gap-4">
                <Card>
                  <CardContent className="space-y-2 mt-2 ">
                    {isFeatured && banner ? (
                      <Image
                        src={banner}
                        alt="banner image"
                        className="w-full object-cover object-center rounded-sm"
                        width={1920}
                        height={680}
                      />
                    ) : null}
                  </CardContent>
                </Card>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue("banner", res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: "destructive",
                      description: `Error: ${error.message}`,
                    });
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className="flex flex-row gap-8">
            <h2 className="font-bold mb-2 text-lg">Publish Product</h2>

            <FormField
              control={form.control}
              name="isPublished"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertArticleSchema>,
                  "isPublished"
                >;
              }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button w-fit"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>

      <div className="flex justify-between">
        <Button asChild type="button" variant="outline">
          <Link
            href={`/admin/products/editor/${product?.id}/product-specifications`}
          >
            <ArrowBigLeft />
            Previous
          </Link>
        </Button>

        <Button asChild type="button" variant="outline">
          <Link href={`/admin/products`}>Return to products</Link>
        </Button>
      </div>
    </>
  );
};

export default PublishProductForm;
