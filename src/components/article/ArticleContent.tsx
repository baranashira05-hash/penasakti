interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div
      className="article-content prose prose-lg max-w-none dark:prose-invert w-full overflow-x-hidden"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
