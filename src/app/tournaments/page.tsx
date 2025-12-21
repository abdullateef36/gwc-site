"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Tournament {
  title: string;
  date: string;
  prize: string;
  image: string;
}

type TabType = "upcoming" | "ongoing" | "completed";

export default function Tournaments() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  const upcoming: Tournament[] = [
    {
      title: "Fortnite Global Cup",
      date: "Nov 18, 2025",
      prize: "$50,000",
      image: "https://picsum.photos/400/250?random=1",
    },
    {
      title: "Valorant Elite Clash",
      date: "Dec 10, 2025",
      prize: "$20,000",
      image: "https://picsum.photos/400/250?random=2",
    },
    {
      title: "Rocket League Rumble",
      date: "Jan 5, 2026",
      prize: "$30,000",
      image: "https://picsum.photos/400/250?random=3",
    },
  ];

  const ongoing: Tournament[] = [
    {
      title: "GWC Arena Masters",
      date: "Oct 10–20, 2025",
      prize: "$40,000",
      image: "https://picsum.photos/400/250?random=4",
    },
    {
      title: "Call of Duty: Vanguard Showdown",
      date: "Oct 5–15, 2025",
      prize: "$25,000",
      image: "https://picsum.photos/400/250?random=5",
    },
  ];

  const completed: Tournament[] = [
    {
      title: "League of Legends Continental Finals",
      date: "Sept 15, 2025",
      prize: "$100,000",
      image: "https://picsum.photos/400/250?random=6",
    },
    {
      title: "Overwatch Blitz Championship",
      date: "Aug 10, 2025",
      prize: "$15,000",
      image: "https://picsum.photos/400/250?random=7",
    },
  ];

  const renderTournaments = (list: Tournament[]) => (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {list.map((tournament, index) => (
        <div
          key={index}
          className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:shadow-[0_0_15px_var(--gwc-red)] transition-all duration-300"
        >
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
            <h3 className="font-semibold text-lg">{tournament.title}</h3>
            <p className="text-gray-400">Date: {tournament.date}</p>
            <p className="text-gray-400">Prize Pool: {tournament.prize}</p>
            <Link
              href="/join"
              className="mt-4 inline-block bg-(--gwc-red) px-4 py-2 rounded font-semibold hover:bg-opacity-90 transition-colors duration-200"
            >
              Register Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  const tabs: { id: TabType; label: string }[] = [
    { id: "upcoming", label: "upcoming" },
    { id: "ongoing", label: "ongoing" },
    { id: "completed", label: "completed" },
  ];

  return (
    <div className="container mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold">Tournaments</h1>
      <p className="mt-4 text-gray-300">
        Browse ongoing, upcoming, and completed tournaments. Register your team or join solo.
      </p>

      {/* Tabs */}
      <div className="flex gap-6 mt-8 border-b border-gray-800" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 uppercase font-semibold tracking-wide transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-(--gwc-red) text-(--gwc-red)"
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
        {activeTab === "upcoming" && renderTournaments(upcoming)}
        {activeTab === "ongoing" && renderTournaments(ongoing)}
        {activeTab === "completed" && renderTournaments(completed)}
      </div>
    </div>
  );
}