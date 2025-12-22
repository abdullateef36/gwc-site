"use client";

import Image from 'next/image'

export default function Community() {
  const clubs = [
    { name: 'GWC Africa Squad', members: 120, desc: 'Regional gamers across Africa sharing tips, scrims, and friendship.' },
    { name: 'Valorant Vanguard', members: 85, desc: 'Dedicated to Valorant strategies, tournaments, and team building.' },
    { name: 'Mobile Masters', members: 200, desc: 'Mobile gamers competing in PUBG, CODM, and Free Fire events.' },
  ]

  const scrims = [
    { date: 'Oct 18, 2025', game: 'Fortnite', type: 'Solo Scrim Night', slots: 100 },
    { date: 'Oct 21, 2025', game: 'Valorant', type: '5v5 Ranked Practice', slots: 60 },
    { date: 'Oct 23, 2025', game: 'Mobile Legends', type: 'Community Clash', slots: 80 },
  ]

  return (
    <div className="min-h-screen bg-gwc-black">
      <div className="container mx-auto px-4 sm:px-6 py-12 text-white">
        {/* Intro */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-4">Community</h1>
          <p className="text-gray-300 text-lg">
            Join clubs, mentorship programs, and weekly scrims. 
            The GWC community connects gamers from every corner of the world to play, grow, and compete together.
          </p>
        </header>

        {/* Featured Banner */}
        <div className="relative bg-gwc-gray border border-gwc-light-gray rounded-xl p-8 mb-12 overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/banner_test.png"
              alt="Community Banner"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold">🎮 The GWC Discord is Live!</h2>
            <p className="mt-2 text-gray-300">
              Meet players, share clips, and get the latest tournament updates in real-time.
            </p>
            <button className="mt-4 bg-gwc-red hover:bg-[#c10500] px-6 py-3 rounded-lg font-semibold transition-colors">
              Join Discord
            </button>
          </div>
        </div>

        {/* Clubs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Top Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clubs.map((club, i) => (
              <div key={i} className="p-6 bg-gwc-gray border border-gwc-light-gray rounded-xl hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{club.desc}</p>
                <div className="flex justify-between items-center text-gray-400 text-sm">
                  <span>{club.members} Members</span>
                  <button className="text-gwc-red font-semibold hover:text-[#c10500] transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mentorship Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Mentorship Program</h2>
          <div className="bg-gwc-gray border border-gwc-light-gray rounded-xl p-6">
            <p className="text-gray-300">
              Level up your skills with GWC Mentorship. Get matched with experienced esports players, content creators, 
              and coaches who can help refine your gameplay or guide your career in gaming.
            </p>
            <button className="mt-4 bg-gwc-red hover:bg-[#c10500] px-6 py-3 rounded-lg font-semibold transition-colors">
              Apply for Mentorship
            </button>
          </div>
        </section>

        {/* Scrims Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Weekly Scrims</h2>
          <div className="space-y-4">
            {scrims.map((scrim, i) => (
              <div key={i} className="bg-gwc-gray border border-gwc-light-gray rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-700 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{scrim.type}</h3>
                  <p className="text-gray-400 text-sm">
                    {scrim.date} • {scrim.game} • {scrim.slots} slots available
                  </p>
                </div>
                <button className="bg-gwc-red hover:bg-[#c10500] px-5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">
                  Join Scrim
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* More Clubs Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">More Gaming Communities</h2>
            <button className="text-gwc-red hover:text-[#c10500] font-semibold transition-colors">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Esports Analytics', 'Streaming Hub', 'Career Builders', 'Cosplay & Art'].map((name, i) => (
              <div key={i} className="bg-gwc-gray border border-gwc-light-gray rounded-xl p-4 text-center hover:border-gray-700 transition-colors">
                <div className="w-12 h-12 bg-gwc-red/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-gray-400 text-xs mt-1">Join now</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16 p-8 bg-linear-to-r from-gwc-black to-gwc-gray border border-gwc-light-gray rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Join the Conversation</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Participate in GWC chats, share gameplay highlights, and meet fellow gamers who share your passion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gwc-red hover:bg-[#c10500] px-8 py-3 rounded-lg font-semibold transition-colors">
              Join Community Now
            </button>
            <button className="bg-transparent border border-gwc-light-gray hover:border-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Explore Features
            </button>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { number: '5K+', label: 'Active Members' },
            { number: '200+', label: 'Weekly Scrims' },
            { number: '50+', label: 'Gaming Clubs' },
            { number: '24/7', label: 'Live Support' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 bg-gwc-gray border border-gwc-light-gray rounded-xl">
              <div className="text-3xl font-bold text-gwc-red">{stat.number}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}