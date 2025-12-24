import { Timestamp } from "firebase/firestore";

export type TournamentStatus = "upcoming" | "ongoing" | "completed";

export interface Tournament {
  id: string;
  title: string;
  date: string;
  prize: string;
  image: string;
  description: string;
  status: TournamentStatus;
  createdBy: string;
  createdAt: Timestamp;
}
