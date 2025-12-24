"use client";

import { useScoreboards } from "@/hooks/useScoreboards";
import ScoreboardCard from "./ScoreboardCard";
import CreateScoreboard from "./CreateScoreboard";
import { useUser } from "@/context/UserContext";

export default function Scoreboards() {
  const scoreboards = useScoreboards();
  const { user, isAdmin } = useUser();

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8">LIVE SCOREBOARDS</h2>

      {isAdmin && user && <CreateScoreboard user={user} />}

      {scoreboards.map((sb) => (
        <ScoreboardCard
          key={sb.id}
          scoreboard={sb}
          isAdmin={isAdmin}
        />
      ))}
    </section>
  );
}
