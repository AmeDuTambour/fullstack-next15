import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getAllArticles } from "@/lib/actions/article.actions";
import Link from "next/link";
import Image from "next/image";
import { EyeClosed, EyeIcon, PenIcon } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AdminArticlesPage = async () => {
  const articles = await getAllArticles({
    filter: "all",
    limit: 10,
    page: 1,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between mb-8">
        <h1 className="h1-bold">Articles</h1>
        <Button asChild variant="default">
          <Link href="/admin/articles/editor/new/enter-title">
            <PenIcon />
            New Article
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {articles.data.map((article) => (
          <Card key={article.id}>
            <CardHeader className="flex items-center content-center">
              <Link href={`/admin/articles/editor/${article.id}/enter-title`}>
                <Image
                  src={""}
                  alt={article.title}
                  height={300}
                  width={300}
                  objectFit="cover"
                />
              </Link>
            </CardHeader>
            <CardContent className="='p-4 grid gap-4">
              <h3 className="h3-bold truncate">{article.title}</h3>
              <Link href={`/admin/articles/editor/${article.id}/add-sections`}>
                <h2 className="text-xs font-medium">
                  Created at: {formatDateTime(article.createdAt).dateOnly}
                </h2>
                <h2 className="text-xs font-medium">
                  Updated at: {formatDateTime(article.updatedAt).dateOnly}
                </h2>
              </Link>
            </CardContent>
            <CardFooter className="w-full flex justify-end p-4">
              {article.isPublished ? (
                <div className="flex flex-row">
                  <EyeIcon /> <span>Published</span>
                </div>
              ) : (
                <div className="flex flex-row">
                  <EyeClosed /> <span>Draft</span>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default AdminArticlesPage;
