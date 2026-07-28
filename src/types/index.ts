import { Article, Category, Tag, User, Comment, Media, Advertisement } from "@prisma/client";

export type { Article, Category, Tag, User, Comment, Media, Advertisement };

export interface ArticleWithRelations extends Article {
  author: Pick<User, "id" | "name" | "image">;
  editor?: Pick<User, "id" | "name"> | null;
  category: Pick<Category, "id" | "name" | "slug" | "color">;
  tags: { tag: Pick<Tag, "id" | "name" | "slug"> }[];
  _count?: { comments: number };
}

export interface ArticleFull extends ArticleWithRelations {
  comments: CommentWithUser[];
  relatedArticles: { related: ArticleWithRelations }[];
}

export interface CommentWithUser extends Comment {
  user?: Pick<User, "id" | "name" | "image"> | null;
  replies?: CommentWithUser[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SearchResult {
  articles: ArticleWithRelations[];
  total: number;
  query: string;
}

export interface DashboardStats {
  totalViews: number;
  totalVisitors: number;
  totalArticles: number;
  totalAuthors: number;
  totalRevenue: number;
  articlesGrowth: number;
  viewsGrowth: number;
  visitorsGrowth: number;
}

export interface AnalyticsData {
  date: string;
  views: number;
  visitors: number;
  pageviews: number;
}

export interface RealtimeVisitor {
  count: number;
  topPages: { page: string; count: number }[];
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SeoProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
  tags?: string[];
}

export interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
}

export interface ToastType {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}

// Session extension
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isBanned?: boolean;
  }
}
