"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUser } from "@/context/UserContext";
import { LogOut, Menu, X } from "lucide-react";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "TOURNAMENTS", href: "/tournaments" },
    { name: "COMMUNITY", href: "/community" },
    { name: "SHOP", href: "/shop" },
    { name: "PROFILE", href: "/profile" },
  ];

  const handleLogout = async () => {
    if (!auth) {
      localStorage.removeItem("authUser");
      router.push("/login");
      return;
    }

    await signOut(auth);
    localStorage.removeItem("authUser");
    localStorage.removeItem("userData");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("displayName"); // remove cached display name
    router.push("/login");
  };

  // Get display name from cached localStorage for instant UI
  const displayName =
    user?.displayName ||
    (typeof window !== "undefined" ? localStorage.getItem("displayName") : "") ||
    "GWC User";

  // Prefer cached userData photoURL for instant UI (updated on upload)
  let cachedPhotoURL: string | null = null;
  if (typeof window !== "undefined") {
    try {
      const ud = localStorage.getItem("userData");
      if (ud) {
        const parsed = JSON.parse(ud);
        cachedPhotoURL = parsed?.photoURL || null;
      }
    } catch {}
  }

  // Cache display name when user is available
  useEffect(() => {
    if (user?.displayName) {
      localStorage.setItem("displayName", user.displayName);
    }
  }, [user?.displayName]);

  return (
    <nav className="relative w-full py-4 px-6 flex items-center justify-between border-b border-gray-800">
      {/* Logo */}
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

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6 text-sm">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link 
              href={item.href}
              className={`hover:text-gwc-red transition-colors ${
                pathname === item.href ? "text-gwc-red font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        {/* Desktop User Info */}
        <div className="hidden md:flex items-center gap-3">
          {loading && !user ? (
            // Skeleton loading placeholder
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-24 h-4 bg-gray-700 rounded" />
              <div className="w-10 h-10 bg-gray-700 rounded-full" />
            </div>
          ) : user ? (
            <>
              <div className="text-right">
                <p className="font-semibold text-white">{displayName}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              {cachedPhotoURL || user.photoURL ? (
               <Link
                  href="/profile"
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gwc-red cursor-pointer hover:opacity-90 transition"
                  title="View profile"
                >
                  <Image
                    src={cachedPhotoURL || (user.photoURL as string)}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <div className="w-10 h-10 bg-gwc-red rounded-full flex items-center justify-center text-white font-bold">
                  {displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            // Not logged in
            <Link 
              href="/login" 
              className="bg-gwc-red py-2 px-4 rounded text-sm font-semibold hover:bg-[#c10500] transition-colors"
            >
              SIGN UP
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {user && (
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden p-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {mobileOpen && user && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gwc-black border-t border-gray-800 py-4 px-6 z-50">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
            {cachedPhotoURL || user.photoURL ? (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gwc-red">
                <Image
                  src={cachedPhotoURL || (user.photoURL as string)}
                  alt={displayName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gwc-red rounded-full flex items-center justify-center text-white font-bold text-lg">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </div>
            )}
            <div>
              <p className="font-semibold text-white">{displayName}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Mobile Nav Items */}
          <div className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 hover:text-gwc-red transition-colors ${
                  pathname === item.href ? "text-gwc-red font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-red-500 hover:text-red-400 transition-colors border-t border-gray-800 pt-4"
          >
            <LogOut size={18} />
            SIGN OUT
          </button>
        </div>
      )}
    </nav>
  );
}
