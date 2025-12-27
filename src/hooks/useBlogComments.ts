import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogComment } from "@/lib/blog";

export function useBlogComments(postId: string) {
  const [comments, setComments] = useState<BlogComment[]>([]);

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "blog-comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<BlogComment, "id">),
      }));

      setComments(data);
    });

    return () => unsubscribe();
  }, [postId]);

  return comments;
}
