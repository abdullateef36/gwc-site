"use client";

import Image from "next/image";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/lib/blog";
import { Trash2, Edit2, Calendar, User, Tag } from "lucide-react";
import { useState } from "react";
import EditBlogPost from "./EditBlogPost";

interface Props {
  post: BlogPost;
  isAdmin: boolean;
}

export default function BlogCard({ post, isAdmin }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);

  const remove = async () => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteDoc(doc(db, "blog-posts", post.id));
    }
  };

  return (
    <>
      <div className="bg-gwc-gray rounded-2xl border border-gwc-light-gray overflow-hidden hover:border-gwc-red/50 hover:shadow-xl hover:shadow-gwc-red/10 transition-all duration-300">
        <Link href={`/blog/${post.id}`}>
          <div className="relative w-full h-48">
            <Image
              src={post.coverImage}
              alt={post.title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 left-3 bg-gwc-red px-3 py-1 rounded-full text-xs font-bold">
              {post.category}
            </div>
            {!post.published && (
              <div className="absolute top-3 right-3 bg-yellow-500 px-3 py-1 rounded-full text-xs font-bold text-black">
                DRAFT
              </div>
            )}
          </div>
        </Link>

        <div className="p-6">
          <Link href={`/blog/${post.id}`}>
            <h3 className="font-semibold text-xl text-white mb-3 hover:text-gwc-red transition-colors">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{post.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</span>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Tag size={14} className="text-gray-500" />
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-[#0d0d0d] border border-gwc-light-gray px-2 py-1 rounded text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Link
              href={`/blog/${post.id}`}
              className="text-gwc-red font-semibold hover:underline"
            >
              Read More →
            </Link>

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={remove}
                  className="p-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditBlogPost post={post} onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
}