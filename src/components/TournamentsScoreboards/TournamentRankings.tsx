// components/TournamentsScoreboards/TournamentRankings.tsx
"use client";

import { useTournamentRankings } from "@/hooks/useRankings";
import TournamentRankingsCard from "./TournamentRankingsCard";
import CreateTournamentRanking from "./CreateTournamentRankings";
import { useUser } from "@/context/UserContext";

export default function TournamentRankings() {
  const rankings = useTournamentRankings();
  const { user, isAdmin } = useUser();

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8">TOURNAMENT RANKINGS</h2>

      {isAdmin && user && <CreateTournamentRanking user={user} />}

      {rankings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No tournament rankings available yet.
        </div>
      ) : (
        <div className="space-y-8">
          {rankings.map((ranking) => (
            <TournamentRankingsCard
              key={ranking.id}
              ranking={ranking}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </section>
  );
}