"use client";
import { admin as t, common } from "@/lib/labels";

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
import ImageUpload from "@/components/shared/image-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  createProduct,
  updateBaseProduct,
} from "@/lib/actions/product.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";
import QRCode from "react-qr-code";
import UploadThingImage from "@/components/shared/uploadthing-image";

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
      ? { ...product, categoryId: product.categoryId }
      : {
          ...productBaseDefaultValue,
          categoryId: categories[0]?.id || "",
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
      toast({ color: "green", description: res.message });
      if (!product) {
        router.replace(`/admin/products/editor/${res.data?.id}/base-product`);
      }
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("GeneratedQRCode");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Impossible d'obtenir le contexte 2D du canvas.");
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <>
      {/* Un dump JSON de l'état du formulaire n'est pas un message d'interface.
          Chaque champ affiche déjà son erreur ; ce bloc annonce simplement
          qu'il en reste. */}
      {Object.keys(form.formState.errors).length > 0 && (
        <p className="text-destructive text-sm">{t.formHasErrors}</p>
      )}
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
                  <FormLabel>{t.productName}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.productNamePlaceholder} {...field} />
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
                  <FormLabel>{t.slug}</FormLabel>
                  <FormControl>
                    <div className="relative flex gap-2">
                      <Input placeholder={t.slugPlaceholder} {...field} />
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
                        {t.generate}
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.category}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectCategory}>
                        {categories.find((c) => c.id === field.value)?.name ||
                          t.selectCategory}
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
                <FormLabel>{t.images}</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {form.watch("images")?.map((image: string, index) => (
                        <UploadThingImage
                          key={image}
                          src={image}
                          onDelete={() => {
                            const updatedImages = form
                              .watch("images")
                              .filter((_, i) => i !== index);
                            form.setValue("images", updatedImages);
                          }}
                        />
                      ))}
                      <FormControl>
                        <ImageUpload
  onUploaded={(url) => {
    form.setValue("images", [
                              ...(form.watch("images") || []),
                              url,
                            ]);
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
                  <FormLabel>{t.price}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.pricePlaceholder} {...field} />
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
                  <FormLabel>{t.stock}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.stockPlaceholder} {...field} />
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
                <FormLabel>{t.description}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t.descriptionPlaceholder}
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="codeIdentifier"
            render={({ field }) => (
              <div className="flex flex-col gap-4 items-center">
                <FormItem className="w-full">
                  <FormLabel>{t.qrCodeValue}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-80"
                      placeholder={t.qrCodePlaceholder}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                {field.value && (
                  <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <QRCode
                      id="GeneratedQRCode"
                      size={128}
                      className="w-32 h-32"
                      value={field.value}
                    />
                    <Button
                      type="button"
                      className="mt-4"
                      onClick={downloadQRCode}
                    >
                      {t.downloadQrCode}
                    </Button>
                  </div>
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button w-fit"
          >
            {form.formState.isSubmitting
              ? common.submitting
              : product
                ? common.save
                : t.createProduct}
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
            {common.next}
          </Link>
          <ArrowBigRight />
        </Button>
      </div>
    </>
  );
};

export default BaseProductForm;
