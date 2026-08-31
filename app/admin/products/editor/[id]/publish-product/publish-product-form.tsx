"use client";
import PublishFields from "@/components/admin/publish-fields";
import { admin as t, common } from "@/lib/labels";

import {
  Form,
} from "@/components/ui/form";
import { productBaseDefaultValue } from "@/lib/constants";
import { baseProductSchema } from "@/lib/validators";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowBigLeft } from "lucide-react";
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
      ? {
          ...product,
          isPublished: product.isPublished ?? false,
          isFeatured: product.isFeatured ?? false,
        }
      : {
          ...productBaseDefaultValue,
        },
  });

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
          <PublishFields
            form={form}
            featureLabel={t.featureProduct}
            publishLabel={t.productVisibility}
            publishOnHint={t.productVisibleHint}
            publishOffHint={t.productHiddenHint}
          />
          <div className="space-y-2">
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="button w-fit"
            >
              {form.formState.isSubmitting ? common.submitting : common.save}
            </Button>
            <p className="text-sm text-muted-foreground">{t.savingApplies}</p>
          </div>
        </form>
      </Form>

      <div className="flex justify-between">
        <Button asChild type="button" variant="outline">
          <Link
            href={`/admin/products/editor/${product?.id}/product-specifications`}
          >
            <ArrowBigLeft />
            {common.previous}
          </Link>
        </Button>

        <Button asChild type="button" variant="outline">
          <Link href={`/admin/products`}>{t.returnToProducts}</Link>
        </Button>
      </div>
    </>
  );
};

export default PublishProductForm;
