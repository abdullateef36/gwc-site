"use client";

import Link from "next/link";
import Image from "next/image";
import {
  SiDiscord,
  SiInstagram,
  SiYoutube,
  SiFacebook,
} from "react-icons/si";
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-[#050505] mt-12 py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/gwc_icon.png" alt="GWC" width={40} height={40} className="w-10" />
            <span className="font-bold text-xl mb-1">GWC</span>
          </div>

          <p className="mt-3 text-gray-400">
            Bringing gamers together across the globe.
          </p>

          <div className="flex gap-4 mt-4 text-gray-400">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <FaXTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <SiInstagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <SiYoutube size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <SiFacebook size={20} />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <SiDiscord size={20} />
            </a>
          </div>
        </div>

        <div className="flex gap-6">
          <div>
            <h4 className="font-semibold">Explore</h4>
            <ul className="mt-2 text-gray-400 space-y-1">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/tournaments" className="hover:text-white transition-colors">Tournaments</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-2 text-gray-400 space-y-1">
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Gamers World Collective. All rights reserved.
      </div>
    </footer>
  );
}
