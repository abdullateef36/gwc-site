"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Scoreboard } from "@/lib/scoreboard";

export function useScoreboards() {
  const [scoreboards, setScoreboards] = useState<Scoreboard[]>([]);

  useEffect(() => {
    // Firestore reference
    const q = query(
      collection(db, "scoreboards"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Scoreboard, "id">),
      }));

      setScoreboards(data);
    });

    return () => unsubscribe();
  }, []);

  return scoreboards;
}
