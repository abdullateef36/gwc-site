import { Timestamp } from "firebase/firestore";


export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  authorId: string;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userEmail: string;
  comment: string;
  createdAt: Timestamp;
}

export type BlogCategory = "News" | "Updates" | "Tournaments" | "Community" | "Tips & Tricks" | "Events";