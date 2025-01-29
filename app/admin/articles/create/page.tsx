import ArticleForm from "@/components/admin/article-form";

const AdminCreateArticlePage = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Create Article</h1>
      <ArticleForm type="Create" />
    </div>
  );
};

export default AdminCreateArticlePage;
