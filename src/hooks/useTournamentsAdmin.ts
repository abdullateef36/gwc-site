// hooks/useTournamentsAdmin.ts
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tournament } from "@/lib/tournaments";

export function useTournamentsAdmin() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "tournaments"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Tournament));

      setTournaments(data);
    });

    return () => unsub();
  }, []);

  return tournaments;
}