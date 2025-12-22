"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

let authInitialized = false;
let cachedUser: User | null = null;
let cachedIsAdmin = false;

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!authInitialized);
  const [isAdmin, setIsAdmin] = useState(cachedIsAdmin);
  const setupRef = useRef(false);

  useEffect(() => {
    // Setup the listener only once globally
    if (!setupRef.current) {
      setupRef.current = true;

      const cached = localStorage.getItem("authUser");
      const cachedAdmin = localStorage.getItem("isAdmin");

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          cachedUser = parsed;
          cachedIsAdmin = cachedAdmin === "true";
          queueMicrotask(() => {
            setUser(parsed);
            setIsAdmin(cachedIsAdmin);
          });
        } catch {}
      }

      const firebaseAuth = auth;

      if (!firebaseAuth) {
        queueMicrotask(() => setLoading(false));
        return;
      }

      onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        cachedUser = firebaseUser;
        let adminStatus = false;

        if (firebaseUser && db) {
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              adminStatus = userData.role === "admin";
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
        }

        cachedIsAdmin = adminStatus;

        queueMicrotask(() => {
          setUser(firebaseUser);
          setIsAdmin(adminStatus);
          setLoading(false);
          authInitialized = true;
        });

        if (firebaseUser) {
          localStorage.setItem("authUser", JSON.stringify(firebaseUser));
          localStorage.setItem("isAdmin", adminStatus.toString());
        } else {
          localStorage.removeItem("authUser");
          localStorage.removeItem("isAdmin");
        }
      });
    } else if (authInitialized) {
      // On subsequent mounts, immediately use cached values
      queueMicrotask(() => {
        setUser(cachedUser);
        setIsAdmin(cachedIsAdmin);
        setLoading(false);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}