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
import { articleFormDefaultValues } from "@/lib/constants";
import { insertArticleSchema } from "@/lib/validators";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { Article } from "@/types";
import { useEffect } from "react";
import { updateArticle } from "@/lib/actions/article.actions";

type PublishArticleFormProps = {
  article?: Article;
};

const PublishArticleForm: React.FC<PublishArticleFormProps> = ({ article }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertArticleSchema>>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: article || articleFormDefaultValues,
  });

  const isPublished = form.watch("isPublished");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  useEffect(() => {
    const handleUpdate = async () => {
      if (!article?.title || !article?.slug) {
        toast({
          variant: "destructive",
          description: "Title and slug are required.",
        });
        return;
      }

      const res = await updateArticle({
        ...article,
        title: article.title,
        slug: article.slug,
        isPublished,
        isFeatured,
        banner,
      });

      if (!res.success) {
        toast({ variant: "destructive", description: res.message });
      } else {
        toast({ description: res.message });
      }
    };

    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublished, isFeatured, banner]);

  if (!article) return <div>No article found.</div>;

  return (
    <Form {...form}>
      <div className="updload-field">
        <h2 className="font-bold mb-2 text-lg">Featured Article</h2>
        <Card>
          <CardContent className="space-y-2 mt-2">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="space-x-2 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is featured ?</FormLabel>
                </FormItem>
              )}
            />
            {isFeatured && banner ? (
              <Image
                src={banner}
                alt="banner image"
                className="w-full object-cover object-center rounded-sm"
                width={1920}
                height={680}
              />
            ) : null}

            {isFeatured && !banner ? (
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
            ) : null}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row gap-8">
        <h2 className="font-bold mb-2 text-lg">Publish Article</h2>

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
    </Form>
  );
};

export default PublishArticleForm;
