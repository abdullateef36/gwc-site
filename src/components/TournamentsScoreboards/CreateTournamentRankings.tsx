import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Plus, X } from "lucide-react";

interface Props {
  user: User;
}

type TeamRankingForm = {
  teamName: string;
  points: number;
  wins: number;
  losses: number;
};

export default function CreateTournamentRanking({ user }: Props) {
  const [tournamentTitle, setTournamentTitle] = useState("");
  const [teams, setTeams] = useState<TeamRankingForm[]>([
    { teamName: "", points: 0, wins: 0, losses: 0 },
    { teamName: "", points: 0, wins: 0, losses: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addRanking = async () => {
    if (!tournamentTitle || teams.some((t) => !t.teamName)) return;

    try {
      setLoading(true);

      const docRef = await addDoc(collection(db, "tournamentRankings"), {
        title: tournamentTitle,
        rankings: teams.map((t) => ({
          position: 0, // calculated on display
          teamName: t.teamName,
          points: t.points,
          wins: t.wins,
          losses: t.losses,
        })),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      // OPTIONAL but recommended: store generated ID in document
      console.log("Ranking created with ID:", docRef.id);

      // Reset form
      setTournamentTitle("");
      setTeams([
        { teamName: "", points: 0, wins: 0, losses: 0 },
        { teamName: "", points: 0, wins: 0, losses: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addTeam = () => {
    setTeams([...teams, { teamName: "", points: 0, wins: 0, losses: 0 }]);
  };

  const removeTeam = (index: number) => {
    if (teams.length > 2) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const updateTeam = <K extends keyof TeamRankingForm>(
    index: number,
    field: K,
    value: TeamRankingForm[K]
  ) => {
    setTeams((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };

  return (
    <div className="bg-gwc-gray p-6 rounded-2xl mb-8 border border-gwc-light-gray shadow-xl hover:border-gwc-red/30 transition-all duration-300">
      <h3 className="font-bold text-2xl mb-6 text-gwc-red">
        Create Tournament Ranking
      </h3>

      <div className="mb-4">
        <input
          value={tournamentTitle}
          onChange={(e) => setTournamentTitle(e.target.value)}
          placeholder="Tournament Title (e.g., GWC Finals 2025)"
          className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none text-white placeholder-gray-500"
        />
      </div>

      <div className="space-y-3 mb-4">
        {teams.map((team, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input
              placeholder="Team Name"
              value={team.teamName}
              onChange={(e) =>
                updateTeam(i, "teamName", e.target.value)
              }
              className="flex-1 p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none text-white placeholder-gray-500"
            />

            {teams.length > 2 && (
              <button
                onClick={() => removeTeam(i)}
                className="p-3 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addTeam}
        className="w-full mb-4 p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray text-gray-400 hover:bg-gwc-gray hover:border-gwc-red/50 hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Add Team
      </button>

      <button
        onClick={addRanking}
        disabled={loading || !tournamentTitle || teams.some((t) => !t.teamName)}
        className="w-full bg-gwc-red hover:bg-[#c10500] disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-[1.02] text-white"
      >
        {loading ? "Creating..." : "Create Ranking"}
      </button>
    </div>
  );
}
