"use client";

import { useState } from "react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogCard from "@/components/blog/BlogCard";
import CreateBlogPost from "@/components/blog/CreateBlogPost";
import { useUser } from "@/context/UserContext";
import { FileText, Plus } from "lucide-react";

export default function BlogPage() {
  const { user, isAdmin } = useUser();
  const posts = useBlogPosts(!isAdmin);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="container mx-auto px-6 py-12 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-gwc-red" size={36} />
            <h1 className="text-3xl font-bold">Blog</h1>
          </div>
          <p className="text-gray-300">
            Latest news, updates, and stories from the GWC community
          </p>
        </div>

        {isAdmin && user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gwc-red hover:bg-[#c10500] px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
          >
            <Plus size={20} />
            New Post
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-gwc-gray rounded-2xl border border-gwc-light-gray">
          <FileText className="mx-auto text-gray-600 mb-4" size={64} />
          <p className="text-lg text-gray-400">No blog posts yet.</p>
          {isAdmin && (
            <p className="mt-2 text-gray-500">Create your first post to get started!</p>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {showCreateModal && user && (
        <CreateBlogPost user={user} onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
