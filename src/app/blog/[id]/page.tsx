"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import CommentSection from "@/components/blog/CommentSection";
import { useParams } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "blog-posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-white">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-12 text-white">
        <div className="text-center py-16">
          <p className="text-xl text-gray-400">Blog post not found</p>
          <Link
            href="/blog"
            className="mt-4 inline-block text-gwc-red hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="relative w-full h-96">
        <Image
          src={post.coverImage}
          alt={post.title}
          className="object-cover"
          fill
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0d0d0d] via-[#0d0d0d]/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white hover:text-gwc-red transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
          
          <div className="inline-block bg-gwc-redx-3 py-1 rounded-full text-sm font-bold mb-4">
            {post.category}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{post.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">{post.excerpt}</p>
          
          <div className="text-gray-300 whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap mt-12 pt-8 border-t border-gwc-light-gray">
            <Tag size={20} className="text-gray-500" />
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gwc-gray border border-gwc-light-gray-gray px-4 py-2 rounded-lg text-gray-300 hover:border-gwc-red transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <CommentSection postId={postId} />
      </div>
    </div>
  );
}