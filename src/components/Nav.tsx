import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Nav() {
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center gap-3">
        <Image 
          src="/gwc_icon.png" 
          alt="GWC" 
          width={40} 
          height={40}
          className="w-10 h-10"
        />
        <span className="font-bold text-2xl mb-1">GWC</span>
      </div>
      <ul className="hidden md:flex items-center gap-6 text-sm">
        <li><Link href="/">HOME</Link></li>
        <li><Link href="/tournaments">TOURNAMENTS</Link></li>
        <li><Link href="/community">COMMUNITY</Link></li>
        {/* <li><Link href="/news">NEWS</Link></li> */}
        <li><Link href="/shop">SHOP</Link></li>
      </ul>
      <div className="flex items-center gap-3">
        <Link href="/join" className="bg-(--gwc-red) py-2 px-4 rounded text-sm font-semibold">JOIN GWC</Link>
      </div>
    </nav> 
  )
}