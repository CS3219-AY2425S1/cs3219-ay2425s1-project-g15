export interface AttemptedQuestion {
  title: string;
  peer: string;
  tags: string[];
  date: string;
}

export interface User {
  username?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
}