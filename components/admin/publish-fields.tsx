"use client";

import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ContentImage from "@/components/ui/content-image";
import ImageUpload from "@/components/shared/image-upload";
import { admin as t } from "@/lib/labels";

/**
 * Champs de publication : mise en avant avec sa bannière, et publication.
 *
 * Les formulaires de publication du produit et de l'article divergeaient de 64
 * lignes sur 184 une fois le vocabulaire neutralisé. Tout ce qui différait
 * réellement, ce sont deux libellés — d'où les deux paramètres.
 *
 * Générique sur le formulaire parent : les deux entités n'ont pas le même
 * schéma, mais elles portent toutes deux `isFeatured` et `banner`.
 */
type PublishFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  featureLabel: string;
  publishLabel: string;
};

export function PublishFields<T extends FieldValues>({
  form,
  featureLabel,
  publishLabel,
}: PublishFieldsProps<T>) {
  const isFeatured = form.watch("isFeatured" as Path<T>);
  const banner = form.watch("banner" as Path<T>);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-8">
          <h2 className="section-title">{featureLabel}</h2>
          <FormField
            control={form.control}
            name={"isFeatured" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={Boolean(field.value)}
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
              <CardContent className="mt-2 space-y-2">
                <ContentImage
                  src={banner as string | undefined}
                  alt={t.banner}
                  width={1920}
                  height={680}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="w-full rounded-sm object-cover object-center"
                />
              </CardContent>
            </Card>
            <ImageUpload
              onUploaded={(url) =>
                form.setValue("banner" as Path<T>, url as never, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-row items-center gap-8">
        <h2 className="section-title">{publishLabel}</h2>
        <FormField
          control={form.control}
          name={"isPublished" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

export default PublishFields;
