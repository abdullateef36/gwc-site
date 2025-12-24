"use client";

import Image from "next/image";
import Link from "next/link";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tournament, TournamentStatus } from "@/lib/tournaments";
import { Trash2, MoveRight, MoveLeft } from "lucide-react";
import { useState } from "react";

interface Props {
  tournament: Tournament;
  isAdmin: boolean;
}

export default function TournamentCard({ tournament, isAdmin }: Props) {
    const [open, setOpen] = useState(false);

  const remove = async () => {
    if (confirm("Are you sure you want to delete this tournament?")) {
      await deleteDoc(doc(db, "tournaments", tournament.id));
    }
  };

  const changeStatus = async (newStatus: TournamentStatus) => {
    await updateDoc(doc(db, "tournaments", tournament.id), {
      status: newStatus,
    });
  };

  const getStatusButtons = () => {
    switch (tournament.status) {
      case "upcoming":
        return (
          <button
            onClick={() => changeStatus("ongoing")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-105 transition-all duration-200"
          >
            <MoveRight size={18} />
            Move to Ongoing
          </button>
        );
      case "ongoing":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => changeStatus("upcoming")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-105 transition-all duration-200"
            >
              <MoveLeft size={18} />
              Back
            </button>
            <button
              onClick={() => changeStatus("completed")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-105 transition-all duration-200"
            >
              <MoveRight size={18} />
              Complete
            </button>
          </div>
        );
      case "completed":
        return (
          <button
            onClick={() => changeStatus("ongoing")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-105 transition-all duration-200"
          >
            <MoveLeft size={18} />
            Back to Ongoing
          </button>
        );
    }
  };

  return (
    <div className="bg-gwc-gray rounded-2xl border border-gwc-light-gray overflow-hidden hover:border-gwc-red/50 hover:shadow-xl hover:shadow-gwc-red/10 transition-all duration-300">
      <div className="relative w-full h-40">
        <Image
          src={tournament.image}
          alt={tournament.title}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-white mb-3">{tournament.title}</h3>
        <p className="text-gray-400 mb-1">Date: {tournament.date}</p>
        <p className="text-gray-400 mb-4">Prize Pool: {tournament.prize}</p>

        {tournament.description && (
        <div className="mb-4 p-3 bg-[#0d0d0d] rounded-lg border border-gwc-light-gray">
            <p className="text-sm text-gray-300 line-clamp-3">
            {tournament.description}
            </p>

            <button
            onClick={() => setOpen(true)}
            className="mt-2 text-sm text-gwc-red hover:underline"
            >
            See more
            </button>
        </div>
        )}
        
        {tournament.status !== "completed" && (
          <Link
            href="/join"
            className="inline-block bg-gwc-red hover:bg-[#c10500] px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-white mb-4"
          >
            Register Now
          </Link>
        )}

        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gwc-light-gray space-y-3">
            {getStatusButtons()}
            <button
              onClick={remove}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gwc-red/10 border border-gwc-red/30 text-gwc-red hover:bg-gwc-red/20 hover:border-gwc-red hover:scale-105 transition-all duration-200 group w-full justify-center"
            >
              <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
              Delete Tournament
            </button>
          </div>
        )}
      </div>
      {open && (
  <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
  onClick={() => setOpen(false)}>
   <div
  className="bg-[#0b0b0b] max-w-lg w-full rounded-2xl border border-gwc-light-gray p-6 relative
           animate-in fade-in zoom-in-95 duration-200"
           onClick={(e) => e.stopPropagation()}>
      {/* Close button */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      <h3 className="text-xl font-semibold text-white mb-4">
        {tournament.title}
      </h3>

      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {tournament.description}
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
