"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { baseProductSchema } from "@/lib/validators";
import { productBaseDefaultValue } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

import {
  createProduct,
  updateBaseProduct,
} from "@/lib/actions/product.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";

type BaseProductFormProps = {
  product?: Product;
  categories: { id: string; name: string }[];
};

const BaseProductForm = ({ product, categories }: BaseProductFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof baseProductSchema>>({
    resolver: zodResolver(baseProductSchema),
    defaultValues: product
      ? { ...product, categoryId: product.categoryId } // Stocke directement `categoryId`
      : {
          ...productBaseDefaultValue,
          categoryId: categories[0]?.id || "", // Sélectionne un `categoryId` par défaut
        },
  });

  const onSubmit: SubmitHandler<z.infer<typeof baseProductSchema>> = async (
    values
  ) => {
    const productType =
      categories.find((c) => c.id === values.categoryId)?.name.toLowerCase() ===
      "drum"
        ? "drum"
        : "other";

    const payload = {
      ...values,
      productType,
    };

    const action = product
      ? () => updateBaseProduct({ ...payload, id: product.id })
      : () => createProduct(payload);

    const res = await action();

    if (!res.success) {
      toast({ variant: "destructive", description: res.message });
    } else {
      toast({ description: res.message });
      if (!product) {
        router.replace(`/admin/products/editor/${res.data?.id}/base-product`);
      }
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
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <div className="relative flex gap-2">
                      <Input placeholder="Enter slug" {...field} />
                      <Button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1"
                        onClick={() => {
                          form.setValue(
                            "slug",
                            slugify(form.getValues("name"), { lower: true })
                          );
                        }}
                      >
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoryId" // 👈 On travaille avec `categoryId`
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange} // Directement avec `categoryId`
                  value={field.value} // Stocke `categoryId`, plus `{ id, name }`
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category">
                        {categories.find((c) => c.id === field.value)?.name ||
                          "Select a category"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
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
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {form
                        .watch("images")
                        ?.map((image: string) => (
                          <Image
                            key={image}
                            src={image}
                            alt="product image"
                            className="w-20 h-20 object-cover object-center rounded-sm"
                            width={100}
                            height={100}
                          />
                        ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue("images", [
                              ...(form.watch("images") || []),
                              res[0].url,
                            ]);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `Error: ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter stock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button w-full"
          >
            {form.formState.isSubmitting
              ? "Submitting"
              : `${product ? "Update" : "Create"}` + " Product"}
          </Button>
        </form>
      </Form>
      <div className="flex justify-end">
        <Button
          disabled={!product || form.formState.isSubmitting}
          size="lg"
          type="button"
          variant="outline"
          className="flex flex-row"
        >
          <Link
            href={`/admin/products/editor/${product?.id}/product-specifications`}
          >
            Next
          </Link>
          <ArrowBigRight />
        </Button>
      </div>
    </>
  );
};

export default BaseProductForm;
