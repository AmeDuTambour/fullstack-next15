"use client";
import PublishFields from "@/components/admin/publish-fields";
import { admin as t, common } from "@/lib/labels";

import {
  Form,
} from "@/components/ui/form";
import { articleFormDefaultValues } from "@/lib/constants";
import { insertArticleSchema } from "@/lib/validators";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
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
          <PublishFields
            form={form}
            featureLabel={t.featureArticle}
            publishLabel={t.articleVisibility}
            publishOnHint={t.articleVisibleHint}
            publishOffHint={t.articleHiddenHint}
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
            {/* Répond à la question que l'écran posait sans y répondre : non,
                rien n'est appliqué avant d'avoir enregistré. */}
            <p className="text-sm text-muted-foreground">{t.savingApplies}</p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PublishArticleForm;
