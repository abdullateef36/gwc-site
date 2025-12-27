"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useBlogComments } from "@/hooks/useBlogComments";
import { useUser } from "@/context/UserContext";
import { MessageSquare, Trash2 } from "lucide-react";

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const { user, isAdmin } = useUser();
  const comments = useBlogComments(postId);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      alert("Please login to comment");
      return;
    }

    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "blog-comments"), {
        postId,
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        userEmail: user.email || "",
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });

      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteDoc(doc(db, "blog-comments", commentId));
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-gwc-red" size={28} />
        <h3 className="text-2xl font-bold text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {user && (
        <div className="mb-8">
          <textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-redocus:outline-none focus:ring-2 focus:ring-gwc-red/50ransition-all text-white placeholder-gray-500 resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-3 bg-gwc-red hover:bg-[#c10500] px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      )}

      {!user && (
        <div className="mb-8 p-4 bg-gwc-gray border border-gwc-light-gray rounded-lg text-center">
          <p className="text-gray-400">Please login to leave a comment</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gwc-gray border border-gwc-light-gray rounded-lg hover:border-gwc-red/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">{comment.userName}</h4>
                  <p className="text-xs text-gray-500">
                    {comment.createdAt?.toDate?.()?.toLocaleString() || "Just now"}
                  </p>
                </div>
                {(isAdmin || user?.uid === comment.userId) && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-1 text-gwc-red hover:bg-gwc-red/10 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-gray-300 whitespace-pre-line">{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
