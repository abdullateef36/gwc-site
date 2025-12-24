export interface Team {
  name: string;
  score: number;
}

export interface Scoreboard {
  id: string;
  title: string;
  teams: Team[];
}
