import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tournament, TournamentStatus } from "@/lib/tournaments";

export function useTournaments(status?: TournamentStatus) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    let q;
    
    if (status) {
      q = query(
        collection(db, "tournaments"),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "tournaments"),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Tournament, "id">),
      }));

      setTournaments(data);
    });

    return () => unsubscribe();
  }, [status]);

  return tournaments;
}
