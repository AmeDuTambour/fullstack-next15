import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getArticleComments } from "@/lib/actions/article.actions";
import { formatDateTime } from "@/lib/utils";
import CommentForm from "./comment-form";
import DeleteCommentButton from "./delete-comment-button";

type CommentsProps = {
  articleId: string;
  slug: string;
};

const Comments = async ({ articleId, slug }: CommentsProps) => {
  const [session, { data: comments }] = await Promise.all([
    auth(),
    getArticleComments(articleId),
  ]);

  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";

  return (
    <section className="space-y-6 pt-16">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" aria-hidden="true" />
        <h2 className="h3-bold">
          {comments.length === 0
            ? "Commentaires"
            : `Commentaires (${comments.length})`}
        </h2>
      </div>

      <Separator />

      {session ? (
        <CommentForm articleId={articleId} />
      ) : (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border p-4">
          <p className="text-muted-foreground">
            Connectez-vous pour laisser un commentaire.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/sign-in?callbackUrl=/blog/${slug}`}>
              Se connecter
            </Link>
          </Button>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-muted-foreground">
          Aucun commentaire pour le moment.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold">{comment.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {comment.user?.name ?? "Utilisateur supprimé"} ·{" "}
                    {formatDateTime(comment.createdAt).dateOnly}
                  </p>
                </div>

                {isAdmin || comment.userId === currentUserId ? (
                  <DeleteCommentButton commentId={comment.id} />
                ) : null}
              </div>

              <p className="mt-3 whitespace-pre-line">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Comments;
