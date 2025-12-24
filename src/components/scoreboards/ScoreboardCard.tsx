"use client";

import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Scoreboard } from "@/lib/scoreboard";
import { Trash2, Plus, Minus } from "lucide-react";

export default function ScoreboardCard({
  scoreboard,
  isAdmin,
}: {
  scoreboard: Scoreboard;
  isAdmin: boolean;
}) {
  const [teams, setTeams] = useState(scoreboard.teams);

  const updateScore = async (teamIndex: number, delta: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].score = Math.max(0, newTeams[teamIndex].score + delta);
    setTeams(newTeams);

    await updateDoc(doc(db, "scoreboards", scoreboard.id), {
      teams: newTeams,
    });
  };

  const remove = async () => {
    if (confirm("Are you sure you want to delete this scoreboard?")) {
      await deleteDoc(doc(db, "scoreboards", scoreboard.id));
    }
  };

  return (
    <div className="bg-gwc-gray p-6 rounded-2xl shadow-xl mb-6 border border-gwc-light-gray hover:border-gwc-red/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gwc-red/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-2xl text-gwc-red">
          {scoreboard.title}
        </h3>
        {isAdmin && (
          <button
            onClick={remove}
            className="p-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-110 transition-all duration-200 group"
            title="Delete scoreboard"
          >
            <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {teams.map((team, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-4 px-4 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray hover:bg-gwc-gray hover:border-gwc-red/30 transition-all duration-200"
          >
            <span className="font-semibold text-lg text-white">{team.name}</span>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => updateScore(i, -1)}
                  className="p-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-110 transition-all duration-200"
                >
                  <Minus size={18} />
                </button>
              )}
              <span className="font-bold text-3xl min-w-15 text-center text-gwc-red">
                {team.score}
              </span>
              {isAdmin && (
                <button
                  onClick={() => updateScore(i, 1)}
                  className="p-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-110 transition-all duration-200"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}