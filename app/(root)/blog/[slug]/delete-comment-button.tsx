"use client";

import { useTransition } from "react";
import { Loader, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteArticleComment } from "@/lib/actions/article.actions";

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
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={onDelete}
      aria-label="Supprimer ce commentaire"
      className="text-muted-foreground hover:text-destructive"
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
};

export default DeleteCommentButton;
