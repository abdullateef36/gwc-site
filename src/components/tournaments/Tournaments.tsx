"use client";

import { useState } from "react";
import { useTournaments } from "@/hooks/useTournaments";
import TournamentCard from "./TournamentCard";
import CreateTournament from "./CreateTournament";
import { useUser } from "@/context/UserContext";
import { TournamentStatus } from "@/lib/tournaments";

export default function Tournaments() {
  const [activeTab, setActiveTab] = useState<TournamentStatus>("upcoming");
  const { user, isAdmin } = useUser();
  
  const upcoming = useTournaments("upcoming");
  const ongoing = useTournaments("ongoing");
  const completed = useTournaments("completed");

  const getTournaments = () => {
    switch (activeTab) {
      case "upcoming":
        return upcoming;
      case "ongoing":
        return ongoing;
      case "completed":
        return completed;
      default:
        return [];
    }
  };

  const tabs: { id: TournamentStatus; label: string }[] = [
    { id: "upcoming", label: "upcoming" },
    { id: "ongoing", label: "ongoing" },
    { id: "completed", label: "completed" },
  ];

  const currentTournaments = getTournaments();

  return (
    <div className="container mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold">Tournaments</h1>
      <p className="mt-4 text-gray-300">
        Browse ongoing, upcoming, and completed tournaments. Register your team or join solo.
      </p>

      {isAdmin && user && (
        <div className="mt-8">
          <CreateTournament user={user} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 mt-8 border-b border-gwc-light-gray" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 uppercase font-semibold tracking-wide transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-gwc-red text-gwc-red"
                : "text-gray-400 hover:text-white"
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
            id={`${tab.id}-tab`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div role="tabpanel" aria-labelledby={`${activeTab}-tab`} className="mt-6">
        {currentTournaments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No {activeTab} tournaments yet.</p>
            {isAdmin && activeTab === "upcoming" && (
              <p className="mt-2">Create your first tournament above!</p>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {currentTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}