// hooks/useTournamentRankings.ts
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TournamentRanking } from "@/lib/rankings";

export function useTournamentRankings() {
  const [rankings, setRankings] = useState<TournamentRanking[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "tournamentRankings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TournamentRanking, "id">),
      }));

      setRankings(data);
    });

    return () => unsubscribe();
  }, []);

  return rankings;
}