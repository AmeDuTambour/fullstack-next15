"use client";

import { PendingButton } from "@/components/ui/pending-button";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { deleteArticleComment } from "@/lib/actions/article.actions";
import { common as t } from "@/lib/labels";

/**
 * N'est rendu que pour l'auteur du commentaire ou un administrateur. Le
 * contrôle qui compte reste côté serveur, dans `deleteArticleComment` : cacher
 * le bouton n'est qu'une commodité.
 */
const DeleteCommentButton = ({ commentId }: { commentId: string }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      const res = await deleteArticleComment(commentId);
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
    });
  };

  return (
    <PendingButton
      type="button"
      variant="ghost"
      size="sm"
      pending={isPending}
      pendingLabel=""
      icon={<Trash2 className="h-4 w-4" />}
      onClick={onDelete}
      aria-label={t.deleteComment}
      className="text-muted-foreground hover:text-destructive"
    />
  );
};

export default DeleteCommentButton;
