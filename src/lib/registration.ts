import { Timestamp } from "firebase/firestore";

export interface TeamMember {
  name: string;
  email: string;
  gameTag: string;
}

export interface TournamentRegistration {
  id?: string;
  tournamentId: string;
  tournamentTitle: string;
  teamName: string;
  captainName: string;
  captainEmail: string;
  captainPhone: string;
  teamMembers: TeamMember[];
  additionalNotes?: string;
  registeredAt: Timestamp;
  status: "pending" | "approved" | "rejected";
}