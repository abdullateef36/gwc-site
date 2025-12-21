"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const slides = [
    {
      image: "https://picsum.photos/800/600?random=11",
      title: "Tournaments",
      link: "/tournaments",
      caption: "Battle your way to the top in GWC-hosted esports events.",
    },
    {
      image: "https://picsum.photos/800/600?random=12",
      title: "Community",
      link: "/community",
      caption: "Join clubs, mentorship programs, and weekly scrims.",
    },
    {
      image: "https://picsum.photos/800/600?random=13",
      title: "News",
      link: "/news",
      caption: "Stay updated on gaming trends, patch notes, and GWC stories.",
    },
    {
      image: "https://picsum.photos/800/600?random=14",
      title: "Shop",
      link: "/shop",
      caption: "Grab exclusive GWC merch, collectibles, and gear.",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const events = [
    {
      title: "GWC Arena Cup – Fortnite Edition",
      date: "2025-10-25",
      image: "https://picsum.photos/400/250?random=1",
    },
    {
      title: "Valorant Clash Series",
      date: "2025-11-10",
      image: "https://picsum.photos/400/250?random=2",
    },
    {
      title: "Rocket League Global Open",
      date: "2025-11-22",
      image: "https://picsum.photos/400/250?random=3",
    },
    {
      title: "Call of Duty: Vanguard Warzone",
      date: "2025-12-05",
      image: "https://picsum.photos/400/250?random=4",
    },
  ];

  return (
    <main className="bg-gwcBlack text-white min-h-screen">
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-extrabold leading-tight">
            WHERE ESPORTS AND COMMUNITY CONVERGE
          </h1>
          <p className="mt-4 text-gray-300">GG no heals.</p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/join"
              className="bg-(--gwc-red) px-6 py-3 rounded font-semibold"
            >
              JOIN GWC
            </Link>
            <Link
              href="/tournaments"
              className="border border-gray-700 px-6 py-3 rounded"
            >
              VIEW EVENTS
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="md:w-1/2 relative">
          <div className="w-full aspect-4/3 rounded-lg border-2 border-(--gwc-red) overflow-hidden relative">
            {slides.map((slide, index) => (
              <Link
                key={index}
                href={slide.link}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === current
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  className="object-cover w-full h-full"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white">
                  <h3 className="text-lg font-bold">{slide.title}</h3>
                  <p className="text-sm text-gray-300">{slide.caption}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full ${
                  i === current ? "bg-(--gwc-red)" : "bg-gray-500"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </header>

      {/* Feature Cards */}
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
        <Link
          href="/tournaments"
          className="p-6 border border-gray-800 rounded-lg hover:scale-105 hover:shadow-[0_0_10px_var(--gwc-red)] transition-transform duration-300 block"
        >
          <h3 className="font-bold text-lg">TOURNAMENTS</h3>
          <p className="mt-2 text-gray-400">
            Compete in local & online GWC-hosted esports competitions across top
            titles.
          </p>
        </Link>

        <Link
          href="/community"
          className="p-6 border border-gray-800 rounded-lg hover:scale-105 hover:shadow-[0_0_10px_var(--gwc-red)] transition-transform duration-300 block"
        >
          <h3 className="font-bold text-lg">COMMUNITY</h3>
          <p className="mt-2 text-gray-400">
            Connect with passionate players, join clubs, and share your gaming
            journey.
          </p>
        </Link>

        <Link
          href="/shop"
          className="p-6 border border-gray-800 rounded-lg hover:scale-105 hover:shadow-[0_0_10px_var(--gwc-red)] transition-transform duration-300 block"
        >
          <h3 className="font-bold text-lg">SHOP</h3>
          <p className="mt-2 text-gray-400">
            Represent GWC with exclusive merch, apparel, and collectibles.
          </p>
        </Link>
      </section>

      {/* Leaderboard */}
      <section className="container mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">LIVE LEADERBOARD</h2>
        <div className="bg-gray-900 rounded-lg p-4">
          <ul>
            {["Victory", "Phoenix", "Raptors", "Legends", "Destroyers"].map(
              (team, i) => (
                <li
                  key={i}
                  className="flex justify-between py-2 border-b border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-gray-400">{i + 1}</span>
                    <span>{team}</span>
                  </div>
                  <div className="text-gray-300">{(5 - i) * 700}</div>
                </li>
              )
            )}
          </ul>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="container mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">UPCOMING EVENTS</h2>
        <div className="flex gap-6 overflow-x-auto py-2">
          {events.map((ev, i) => (
            <div
              key={i}
              className="min-w-70 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-lg hover:scale-105 hover:shadow-[0_0_15px_var(--gwc-red)] transition-transform duration-300"
            >
              <div className="relative w-full h-40">
                <Image
                  src={ev.image}
                  alt={ev.title}
                  className="object-cover"
                  fill
                  sizes="280px"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{ev.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{ev.date}</p>
                <div className="mt-4">
                  <Link
                    href="/tournaments"
                    className="bg-(--gwc-red) px-3 py-2 rounded text-sm inline-block"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="container mx-auto px-6 py-8">
        <h2 className="text-xl font-bold mb-4">PARTNERS & SPONSORS</h2>
        <div className="flex items-center gap-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="relative w-28 h-15">
              <Image
                src={`https://picsum.photos/120/60`}
                className="opacity-80"
                alt={`partner-${num}`}
                fill
                sizes="112px"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}