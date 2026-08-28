"use client";
import { admin as t, common } from "@/lib/labels";

import { ArticleSection } from "@/types";
import { Button } from "../ui/button";
import { Loader, PlusIcon } from "lucide-react";
import { SectionEditor } from "./section-editor";
import Link from "next/link";
import { createArticleSection } from "@/lib/actions/article.actions";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";

type ArticleSectionsFormProps = {
  sections: ArticleSection[];
  articleId: string;
};

const AddSectionsForm: React.FC<ArticleSectionsFormProps> = ({
  sections,
  articleId,
}) => {
  const { toast } = useToast();
  const [isCreating, startCreating] = useTransition();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const addSection = async () => {
    startCreating(async () => {
      const res = await createArticleSection(articleId);
      if (!res.success) {
        toast({ variant: "destructive", description: res.message });
      }
      toast({ description: res.message });
    });
  };

  return (
    <div className="space-y-8">
      {sections.map((section, i) => (
        <div key={section.sectionId} className="border p-4 rounded-md">
          <SectionEditor
            index={i}
            data={section}
            isSaving={(value) => setIsSaving(value)}
          />
        </div>
      ))}
      <div className="flex justify-center">
        <Button type="button" variant="outline" onClick={addSection}>
          {isCreating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}{" "}
          {t.addSection}
        </Button>
      </div>
      <div className="flex justify-between">
        <Button disabled={isSaving} asChild type="button" variant="outline">
          <Link href={`/admin/articles/editor/${articleId}/enter-title`}>
            {common.previous}
          </Link>
        </Button>

        <Button disabled={isSaving} asChild type="button" variant="outline">
          <Link href={`/admin/articles/editor/${articleId}/publish-article`}>
            {common.next}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AddSectionsForm;
