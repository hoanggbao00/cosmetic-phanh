export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: number;
  author: {
    name: string;
    avatar: string;
    bio?: string;
    role?: string;
  };
  categories: string[];
  featured?: boolean;
}
