"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateProductSpecifications } from "@/lib/actions/product.actions";
import {
  drumSpecificationsSchema,
  otherSpecificationsSchema,
} from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ProductSpecificationsProps = {
  category: string;
  formOptions?: Record<"skinTypes" | "dimensions", Record<string, string>[]>;
  product: Product;
};

const ProductSpecificationsForm = ({
  category,
  formOptions,
  product,
}: ProductSpecificationsProps) => {
  if (!category || !formOptions) notFound();
  const { toast } = useToast();

  const schema =
    category === "Drum" ? drumSpecificationsSchema : otherSpecificationsSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: product?.specifications
      ? product.specifications
      : category === "Drum"
        ? { skinTypeId: "", dimensionsId: "" }
        : { color: "", material: "", size: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const res = await updateProductSpecifications(product.id, values);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });

        return;
      }

      form.reset(values);

      toast({
        description: res.message || "Specifications updated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Error: ${error}`,
      });

      form.setError("root", { message: "An unexpected error occurred." });
    }
  };

  const SpecificationsForm = () => {
    if (category === "Drum") {
      return (
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="skinTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skin Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a skin type">
                        {formOptions.skinTypes.find(
                          (skin) => skin.id === field.value
                        )?.material || "Select a skin type"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formOptions.skinTypes.map((skin) => (
                      <SelectItem key={skin.id} value={skin.id}>
                        {skin.material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dimensionsId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dimensions</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dimensions">
                        {formOptions.dimensions.find(
                          (dim) => dim.id === field.value
                        )?.size || "Select dimensions"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formOptions.dimensions.map((dim) => (
                      <SelectItem key={dim.id} value={dim.id}>
                        {dim.size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    }
    if (category === "Other") {
      return <></>; // ✅ Ajoute ici les champs spécifiques aux autres types
    }
    return null;
  };

  return (
    <>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <SpecificationsForm />
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button w-fit"
          >
            {form.formState.isSubmitting
              ? "Submitting"
              : `${product.specifications ? "Update Specs" : "Add Specs"}`}
          </Button>
        </form>
      </Form>

      <div className="flex justify-end gap-2">
        <Button
          disabled={form.formState.isSubmitting}
          size="lg"
          type="button"
          variant="outline"
          className="flex flex-row"
        >
          <ArrowBigLeft />
          <Link href={`/admin/products/editor/${product?.id}/base-product`}>
            Previous
          </Link>
        </Button>
        <Button
          disabled={!product.specifications || form.formState.isSubmitting}
          size="lg"
          type="button"
          variant="outline"
          className="flex flex-row"
        >
          <Link href={`/admin/products/editor/${product?.id}/publish-product`}>
            Next
          </Link>
          <ArrowBigRight />
        </Button>
      </div>
    </>
  );
};

export default ProductSpecificationsForm;
