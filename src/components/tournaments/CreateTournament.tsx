"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Trophy } from "lucide-react";

interface Props {
  user: User;
}

export default function CreateTournament({ user }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [prize, setPrize] = useState("");
  const [image, setImage] = useState("");

  const addTournament = async () => {
    if (!title || !date || !prize || !image) return;

    await addDoc(collection(db, "tournaments"), {
      title,
      date,
      prize,
      image,
      status: "upcoming",
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setDate("");
    setPrize("");
    setImage("");
  };

  return (
    <div className="bg-gwc-gray p-6 rounded-2xl mb-8 border border-gwc-light-gray shadow-xl hover:border-gwc-red/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-gwc-red" size={28} />
        <h3 className="font-bold text-2xl text-gwc-red">
          Create Tournament
        </h3>
      </div>

      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tournament title"
          className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
        />

        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date (e.g., Nov 18, 2025)"
          className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50ransition-all text-white placeholder-gray-500"
        />

        <input
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
          placeholder="Prize pool (e.g., $50,000)"
          className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
        />

        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
        />
      </div>

      <button
        onClick={addTournament}
        className="w-full mt-6 bg-gwc-red hover:bg-[#c10500] px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gwc-red/50 active:scale-[0.98] text-white"
      >
        Create Tournament
      </button>
    </div>
  );
}
