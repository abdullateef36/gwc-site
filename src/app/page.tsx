"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Scoreboards from "@/components/scoreboards/Scoreboards";

export default function Home() {
  const slides = [
    {
      image: "https://www.sportspro.com/wp-content/uploads/2021/06/esports_arenas_main-1.jpg",
      title: "Tournaments",
      link: "/tournaments",
      caption: "Battle your way to the top in GWC-hosted esports events.",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/LGD_Gaming_at_the_2015_LPL_Summer_Finals.jpg/1200px-LGD_Gaming_at_the_2015_LPL_Summer_Finals.jpg",
      title: "Community",
      link: "/community",
      caption: "Join clubs, mentorship programs, and weekly scrims.",
    },
    {
      image: "https://www.newscaststudio.com/wp-content/uploads/2019/12/esports-broadcast-production.jpg",
      title: "News",
      link: "/news",
      caption: "Stay updated on gaming trends, patch notes, and GWC stories.",
    },
    {
      image: "https://coreflexind.com/cdn/shop/articles/jersey_f08498e8-bd8f-4bf1-813c-89b30256df7e.jpg?v=1759296821",
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
      image: "https://images.seattletimes.com/wp-content/uploads/2018/07/urn-publicid-ap-org-f8da2461129949a2bc2e91cb8e996e95Overwatch_League-Fending_Off_Fortnite_03107.jpg?d=2040x1458",
    },
    {
      title: "Valorant Clash Series",
      date: "2025-11-10",
      image: "https://admin.esports.gg/wp-content/uploads/2022/09/VCT-Champs-Istanbul-Viewership.jpg",
    },
    {
      title: "Rocket League Global Open",
      date: "2025-11-22",
      image: "https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2017/08/18/d97bf31b-bef0-42a8-8ad9-5b0c8396c6fd/rocket-league-universal-lead",
    },
    {
      title: "Call of Duty: Vanguard Warzone",
      date: "2025-12-05",
      image: "https://esportsinsider.com/wp-content/uploads/2023/09/world-series-of-warzone-2023-viewership.jpg",
    },
  ];

  return (
    <main className="bg-linear-to-b from-gwcBlack to-gray-900 text-white min-h-screen">
      {/* Full-width Hero Carousel - touches navbar */}
      <header className="relative h-screen md:h-[85vh] overflow-hidden">
        {/* Carousel */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <Link
              key={index}
              href={slide.link}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                className="object-cover w-full h-full brightness-75"
                fill
                sizes="100vw"
                priority={index === 0}
              />
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>

              {/* Slide caption */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h3 className="text-3xl md:text-5xl font-bold">{slide.title}</h3>
                <p className="text-lg md:text-xl text-gray-300 mt-3 max-w-2xl">{slide.caption}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Main hero text overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-2xl">
            WHERE ESPORTS AND COMMUNITY CONVERGE
          </h1>
          <div className="mt-10">
            <Link
              href="/tournaments"
              className="border border-(--gwc-red) px-8 py-4 rounded-lg text-lg font-semibold hover:bg-(--gwc-red) transition-colors"
            >
              VIEW EVENTS
            </Link>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-4 h-4 rounded-full transition-all ${
                i === current ? "bg-(--gwc-red) scale-125" : "bg-gray-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </header>

      {/* Rest of sections (with container for normal layout) */}
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
        {/* Feature Cards */}
        <Link
          href="/tournaments"
          className="p-8 bg-gray-900 rounded-xl shadow-md hover:shadow-[0_0_20px_var(--gwc-red)] hover:scale-105 transition-all duration-300 block"
        >
          <h3 className="font-bold text-2xl">TOURNAMENTS</h3>
          <p className="mt-4 text-gray-300">
            Compete in local & online GWC-hosted esports competitions across top titles.
          </p>
        </Link>

        <Link
          href="/community"
          className="p-8 bg-gray-900 rounded-xl shadow-md hover:shadow-[0_0_20px_var(--gwc-red)] hover:scale-105 transition-all duration-300 block"
        >
          <h3 className="font-bold text-2xl">COMMUNITY</h3>
          <p className="mt-4 text-gray-300">
            Connect with passionate players, join clubs, and share your gaming journey.
          </p>
        </Link>

        <Link
          href="/shop"
          className="p-8 bg-gray-900 rounded-xl shadow-md hover:shadow-[0_0_20px_var(--gwc-red)] hover:scale-105 transition-all duration-300 block"
        >
          <h3 className="font-bold text-2xl">SHOP</h3>
          <p className="mt-4 text-gray-300">
            Represent GWC with exclusive merch, apparel, and collectibles.
          </p>
        </Link>
      </section>

      {/* Leaderboard */}
      <Scoreboards />

      {/* Upcoming Events */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">UPCOMING EVENTS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((ev, i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-[0_0_20px_var(--gwc-red)] hover:scale-105 transition-all duration-300"
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={ev.image}
                  alt={ev.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">{ev.title}</h3>
                <p className="text-sm text-gray-300 mt-2">{ev.date}</p>
                <div className="mt-6">
                  <Link
                    href="/tournaments"
                    className="bg-(--gwc-red) px-5 py-3 rounded font-semibold text-sm hover:bg-[#c10500] transition-colors"
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
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8">PARTNERS & SPONSORS</h2>
        <div className="flex flex-wrap items-center gap-12 justify-center">
          {[1, 2, 3].map((num) => (
            <div key={num} className="relative w-40 h-20 opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="https://picsum.photos/160/80"
                alt={`partner-${num}`}
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}