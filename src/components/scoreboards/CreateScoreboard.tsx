import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Plus, X } from "lucide-react";

interface Props {
  user: User;
}

export default function CreateScoreboard({ user }: Props) {
  const [title, setTitle] = useState("");
  const [teams, setTeams] = useState([
    { name: "", score: 0 },
    { name: "", score: 0 },
  ]);

  const addScoreboard = async () => {
    if (!title || teams.some(t => !t.name)) return;

    await addDoc(collection(db, "scoreboards"), {
      title,
      teams,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setTeams([
      { name: "", score: 0 },
      { name: "", score: 0 },
    ]);
  };

  const addTeam = () => {
    setTeams([...teams, { name: "", score: 0 }]);
  };

  const removeTeam = (index: number) => {
    if (teams.length > 2) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-gwc-gray p-6 rounded-2xl mb-8 border border-gwc-light-gray shadow-xl hover:border-gwc-red/30ransition-all duration-300">
      <h3 className="font-bold text-2xl mb-6 text-gwc-red">
        Create Scoreboard
      </h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Scoreboard title"
        className="w-full mb-4 p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
      />

      <div className="space-y-3 mb-4">
        {teams.map((team, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder={`Team ${i + 1} name`}
              value={team.name}
              onChange={(e) => {
                const copy = [...teams];
                copy[i].name = e.target.value;
                setTeams(copy);
              }}
              className="flex-1 p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
            />
            {teams.length > 2 && (
              <button
                onClick={() => removeTeam(i)}
                className="p-3 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-105 transition-all duration-200"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addTeam}
        className="w-full mb-4 p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray text-gray-400 hover:bg-gwc-gray hover:border-gwc-red/50 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Team
      </button>

      <button
        onClick={addScoreboard}
        className="w-full bg-gwc-red hover:bg-[#c10500] px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gwc-red/50 active:scale-[0.98] text-white"
      >
        Create Scoreboard
      </button>
    </div>
  );
}