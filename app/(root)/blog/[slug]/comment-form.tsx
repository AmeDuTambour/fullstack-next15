"use client";

import { PendingButton } from "@/components/ui/pending-button";
import { common } from "@/lib/labels";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createArticleComment } from "@/lib/actions/article.actions";
import { insertArticleCommentSchema } from "@/lib/validators";
import { SendIcon } from "lucide-react";

type CommentFormProps = {
  articleId: string;
};

const CommentForm = ({ articleId }: CommentFormProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof insertArticleCommentSchema>>({
    resolver: zodResolver(insertArticleCommentSchema),
    defaultValues: { title: "", body: "" },
  });

  const onSubmit = (values: z.infer<typeof insertArticleCommentSchema>) => {
    startTransition(async () => {
      const res = await createArticleComment(articleId, values);

      if (!res.success) {
        toast({ variant: "destructive", description: res.message });
        return;
      }

      form.reset();
      toast({ description: res.message });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border p-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Le titre de votre commentaire" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaire</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Partagez votre lecture..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <PendingButton
            type="submit"
            pending={isPending}
            icon={<SendIcon className="h-4 w-4" />}
          >
            {common.publish}
          </PendingButton>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
