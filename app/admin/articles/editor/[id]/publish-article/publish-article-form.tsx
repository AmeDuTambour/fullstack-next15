"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { articleFormDefaultValues } from "@/lib/constants";
import { insertArticleSchema } from "@/lib/validators";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateArticle } from "@/lib/actions/article.actions";

type PublishArticleFormProps = {
  article?: Article;
};

const PublishArticleForm: React.FC<PublishArticleFormProps> = ({ article }) => {
  if (!article) notFound();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertArticleSchema>>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: article || articleFormDefaultValues,
  });

  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  const onSubmit: SubmitHandler<z.infer<typeof insertArticleSchema>> = async (
    values
  ) => {
    const res = await updateArticle({ ...values, id: article.id });
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
              <h2 className="font-bold mb-2 text-lg">Feature Article</h2>
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
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
                  <CardContent className="space-y-2 mt-2">
                    {banner && (
                      <Image
                        src={banner}
                        alt="banner image"
                        className="w-full object-cover object-center rounded-sm"
                        width={1920}
                        height={680}
                      />
                    )}
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
            <h2 className="font-bold mb-2 text-lg">Publish Article</h2>
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
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
          <Link href={`/admin/articles`}>Return to articles</Link>
        </Button>
      </div>
    </>
  );
};

export default PublishArticleForm;
