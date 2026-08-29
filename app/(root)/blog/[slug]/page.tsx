import { getArticleBySlug } from "@/lib/actions/article.actions";
import { notFound } from "next/navigation";
import ArticleSectionBlock from "./article-section-block";
import { formatDateTime } from "@/lib/utils";
import ShareButton from "@/components/shared/share-button";
import { Separator } from "@/components/ui/separator";
import Comments from "./comments";
import ContentImage from "@/components/ui/content-image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { blog as t } from "@/lib/labels";
import { APP_DESCRIPTION } from "@/lib/constants";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const description =
    article.sections?.[0]?.body?.slice(0, 200) || APP_DESCRIPTION;

  return {
    title: article.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: `/blog/${slug}`,
      publishedTime: article.createdAt.toISOString(),
      images: article.banner ? [{ url: article.banner }] : undefined,
    },
    twitter: {
      card: article.banner ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images: article.banner ? [article.banner] : undefined,
    },
  };
}

const ArticlePage = async (props: {
  params: Promise<{
    slug: string;
  }>;
}) => {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="space-y-4 p-8 max-w-5xl mx-auto">
      {" "}
      {article.banner ? (
        <ContentImage
          src={article.banner}
          alt={article.title}
          width={1920}
          height={680}
          sizes="(min-width: 1024px) 64rem, 100vw"
          priority
          className="aspect-[16/6] w-full rounded-lg object-cover"
        />
      ) : null}
      <h1 className="page-title">{article.title}</h1>{" "}
      <Separator className="my-2" />
      <div className="flex justify-between px-4">
        <p className="text-muted-foreground italic pb-4">
          {formatDateTime(article.createdAt).dateOnly}
        </p>
        <ShareButton
          title={article.title}
          url={`https://lamedutambour.com/blog/${slug}`}
        />
      </div>
      <Separator className="my-2" />
      {article.sections.map((section) => (
        <div key={section.sectionId} className="pt-16">
          <ArticleSectionBlock section={section} />
        </div>
      ))}
      {/* Un article se terminait sur rien : ni retour, ni suite, ni lien vers
          les instruments dont il parle. */}
      <div className="flex flex-wrap gap-3 pt-16">
        <Button asChild variant="outline">
          <Link href="/blog">{t.backToBlog}</Link>
        </Button>
        <Button asChild>
          <Link href="/search">{t.seeDrums}</Link>
        </Button>
      </div>

      <Comments articleId={article.id} slug={slug} />
    </div>
  );
};

export default ArticlePage;
