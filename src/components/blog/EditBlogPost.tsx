import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FileText, X } from "lucide-react";
import { BlogPost, BlogCategory } from "@/lib/blog";

interface Props {
  post: BlogPost;
  onClose: () => void;
}

export default function EditBlogPost({ post, onClose }: Props) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [coverImage, setCoverImage] = useState(post.coverImage);
  const [category, setCategory] = useState<BlogCategory>(post.category as BlogCategory);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [published, setPublished] = useState(post.published);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: BlogCategory[] = [
    "News",
    "Updates",
    "Tournaments",
    "Community",
    "Tips & Tricks",
    "Events",
  ];

  const handleSubmit = async () => {
    if (!title || !content || !excerpt || !coverImage) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await updateDoc(doc(db, "blog-posts", post.id), {
        title,
        content,
        excerpt,
        coverImage,
        category,
        tags: tagsArray,
        published,
        updatedAt: serverTimestamp(),
      });

      alert("Blog post updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating blog post:", error);
      alert("Failed to update blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 overflow-y-auto py-8">
      <div
        className="bg-gwc-gray max-w-4xl w-full rounded-2xl border border-gwc-light-gray p-6 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gwc-light-gray rounded-lg transition-all"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-gwc-red" size={28} />
          <h2 className="text-2xl font-bold text-white">Edit Blog Post</h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
          />

          <textarea
            placeholder="Excerpt (Short description for preview) *"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500 resize-none"
          />

          <textarea
            placeholder="Content (Full blog post content) *"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500 resize-none"
          />

          <input
            type="text"
            placeholder="Cover Image URL *"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogCategory)}
              className="p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 rounded border-gwc-light-gray bg-[#0d0d0d] text-gwc-red focus:ring-gwc-red focus:ring-offset-0"
            />
            <span className="text-white">Published</span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gwc-red hover:bg-[#c10500] px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </button>
        </div>
      </div>
    </div>
  );
}