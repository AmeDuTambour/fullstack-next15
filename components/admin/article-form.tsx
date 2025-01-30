"use client";

import { articleFormDefaultValues } from "@/lib/constants";
import { insertArticleSchema, updateArticleSchema } from "@/lib/validators";
import { Article } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import slugify from "slugify";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ParagraphEditor } from "./paragraph-editor";

type ArticleFormProps = {
  type: "Create" | "Update";
  article?: Article;
  articleId?: string;
};

const ArticleForm: React.FC<ArticleFormProps> = ({ type, article }) => {
  const [paragraphFields, setParagraphFields] = useState([""]);

  const form = useForm<Zod.infer<typeof insertArticleSchema>>({
    resolver:
      type === "Create"
        ? zodResolver(insertArticleSchema)
        : zodResolver(updateArticleSchema),
    defaultValues:
      article && type === "Update" ? article : articleFormDefaultValues,
  });

  const addParagraph = () => {
    setParagraphFields([...paragraphFields, ""]);
  };

  const onSubmit = async () => {
    return;
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {paragraphFields.map((_, i) => (
          <ParagraphEditor key={i} index={i} name={`Paragraph ${i + 1}`} />
        ))}
        <div className="flex justify-center md:flex-row">
          <Button type="button" variant="outline" onClick={addParagraph}>
            <PlusIcon /> Add paragraph
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArticleForm;
