import ArticleEditor from "@/components/dashboard/ArticleEditor";

export const metadata = {
  title: "Buat Artikel Baru | Dashboard PenaSakti",
};

export default function CreateArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Buat Artikel Baru</h1>
      <ArticleEditor mode="create" />
    </div>
  );
}
