import ArticleForm from "@/components/admin/article-form";

const AdminArticleUpdatePage = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Article</h1>
      <ArticleForm type="Update" />
    </div>
  );
};

export default AdminArticleUpdatePage;
