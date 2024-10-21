export interface AttemptedQuestion {
  title: string;
  peer: string; // username
  tags: string[];
  date: string;
}

export interface User {
  access_token?: string;
  username?: string;
  history?: AttemptedQuestion[];
  linkedin?: string;
  github?: string;
}