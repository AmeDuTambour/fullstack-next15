"use client";

import { useToast } from "@/hooks/use-toast";
import { createProduct } from "@/lib/actions/product.actions";

import { UploadButton } from "@/lib/uploadthing";
import { baseProductSchema, ProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ProductFormProps = {
  type: "Create" | "Update";
  product?: z.infer<typeof ProductSchema>;
  productId?: string;
  options: {
    categories: { id: string; name: string }[];
    skinTypes?: { id: string; material: string }[];
    dimensions?: { id: string; size: string }[];
  };
};

const ProductForm: React.FC<ProductFormProps> = ({
  type,
  product,
  productId,
  options,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const { categories, skinTypes, dimensions } = options;

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues:
      product && type === "Update"
        ? product
        : {
            ...baseProductSchema,
            categoryId: categories[0]?.id || "",
          },
  });

  const selectedCategoryName = categories.find(
    (c) => c.id === form.watch("categoryId")
  )?.name;

  const onSubmit: SubmitHandler<z.infer<typeof ProductSchema>> = async (
    values
  ) => {
    const action = type === "Create" ? createProduct : updateProduct;
    const payload = type === "Create" ? values : { ...values, id: productId };

    const res = await action(payload);

    if (!res.success) {
      toast({ variant: "destructive", description: res.message });
    } else {
      toast({ description: res.message });
      router.push("/admin/products");
    }
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* 🏷 Nom & Slug */}
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

        {/* 📂 Catégorie */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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

        {selectedCategoryName === "Drums" ? (
          <>
            <FormField
              control={form.control}
              name="specifications.skinTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skin Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skin type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skinTypes?.map((skinType) => (
                        <SelectItem key={skinType.id} value={skinType.id}>
                          {skinType.material}
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
              name="specifications.dimensionsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dimensions" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {dimensions?.map((dimension) => (
                        <SelectItem key={dimension.id} value={dimension.id}>
                          {dimension.size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="specifications.color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specifications.material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter material" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specifications.size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="space-x-2 items-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Is featured?</FormLabel>
            </FormItem>
          )}
        />
        {form.watch("isFeatured") && (
          <FormField
            control={form.control}
            name="banner"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Banner Image</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2">
                    {form.watch("banner") ? (
                      <Image
                        src={form.watch("banner")}
                        alt="banner image"
                        className="w-full object-cover object-center rounded-sm"
                        width={1920}
                        height={680}
                      />
                    ) : (
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
                    )}
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* ✍️ Description */}
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

        {/* 🔘 Bouton Submit */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button w-full"
        >
          {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
