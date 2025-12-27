import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/lib/blog";

export function useBlogPosts(publishedOnly = true) {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let q;
    
    if (publishedOnly) {
      q = query(
        collection(db, "blog-posts"),
        where("published", "==", true),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "blog-posts"),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<BlogPost, "id">),
      }));

      setPosts(data);
    });

    return () => unsubscribe();
  }, [publishedOnly]);

  return posts;
}
