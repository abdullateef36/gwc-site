import { Timestamp } from "firebase/firestore";

export interface RankingEntry {
  position: number;   // Will be auto-calculated on display (based on points/wins)
  teamName: string;
  points: number;
  wins: number;
  losses: number;
}

export interface TournamentRanking {
  title: string;
  id: string;
  tournamentId: string;            
  rankings: RankingEntry[];
  lastUpdated: Timestamp;            
  createdBy: string;           
  createdAt: Timestamp;              
}