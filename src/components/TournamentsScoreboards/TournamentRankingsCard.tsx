// components/TournamentsScoreboards/TournamentRankingsCard.tsx
"use client";

import { useState } from "react";
import { deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TournamentRanking, RankingEntry } from "@/lib/rankings";
import { Trash2, Plus, Minus } from "lucide-react";

export default function TournamentRankingsCard({
  ranking,
  isAdmin,
}: {
  ranking: TournamentRanking;
  isAdmin: boolean;
}) {
  const [rankings, setRankings] = useState<RankingEntry[]>(ranking.rankings);

  const updateTeam = async (index: number, field: "points" | "wins" | "losses", delta: number) => {
    const newRankings = [...rankings];
    if (field === "points") newRankings[index].points = Math.max(0, newRankings[index].points + delta);
    if (field === "wins") newRankings[index].wins = Math.max(0, newRankings[index].wins + delta);
    if (field === "losses") newRankings[index].losses = Math.max(0, newRankings[index].losses + delta);

    setRankings(newRankings);

    await updateDoc(doc(db, "tournamentRankings", ranking.id), {
      rankings: newRankings,
      lastUpdated: serverTimestamp(),
    });
  };

  const remove = async () => {
    if (confirm("Are you sure you want to delete this ranking?")) {
      await deleteDoc(doc(db, "tournamentRankings", ranking.id));
    }
  };

  // Sort by points descending, then wins descending
  const sortedRankings = [...rankings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  return (
    <div className="bg-gwc-gray p-6 rounded-2xl shadow-xl mb-6 border border-gwc-light-gray hover:border-gwc-red/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gwc-red/10">
      {/* Tournament Title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gwc-red">
            {ranking.title || "Untitled Tournament"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Last updated: {ranking.lastUpdated?.toDate?.().toLocaleString() || "Just now"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={remove}
            className="p-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-110 transition-all duration-200 group"
            title="Delete ranking"
          >
            <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gwc-light-gray">
              <th className="pb-3 pr-4">#</th>
              <th className="pb-3 pr-8">Team</th>
              <th className="pb-3 pr-6 text-center">Points</th>
              <th className="pb-3 pr-6 text-center">W</th>
              <th className="pb-3 text-center">L</th>
              {isAdmin && <th className="pb-3"></th>}
            </tr>
          </thead>
          <tbody>
            {sortedRankings.map((entry, i) => (
              <tr
                key={i}
                className="border-b border-gwc-light-gray/30 py-4 hover:bg-[#0d0d0d] transition-all"
              >
                <td className="py-4 pr-4 font-bold text-xl text-gwc-red">{i + 1}</td>
                <td className="py-4 pr-8 font-semibold text-lg text-white">{entry.teamName}</td>
                <td className="py-4 pr-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => updateTeam(i, "points", -1)}
                        className="p-1 rounded bg-gwc-red/10 hover:bg-gwc-red/20"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                    <span className="font-bold text-2xl text-gwc-red min-w-12">{entry.points}</span>
                    {isAdmin && (
                      <button
                        onClick={() => updateTeam(i, "points", 1)}
                        className="p-1 rounded bg-gwc-red/10 hover:bg-gwc-red/20"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4 pr-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => updateTeam(i, "wins", -1)}
                        className="p-1 rounded bg-gwc-red/10 hover:bg-gwc-red/20"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                    <span className="font-bold text-xl">{entry.wins}</span>
                    {isAdmin && (
                      <button
                        onClick={() => updateTeam(i, "wins", 1)}
                        className="p-1 rounded bg-gwc-red/10 hover:bg-gwc-red/20"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => updateTeam(i, "losses", -1)}
                        className="p-1 rounded bg-gwc-red/10 hover:bg-gwc-red/20"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                    <span className="font-bold text-xl">{entry.losses}</span>
                    {isAdmin && (
                      <button
                        onClick={() => updateTeam(i, "losses", 1)}
                        className="p-1 rounded bg-gwc-red/10 hover:bg-gwc-red/20"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
