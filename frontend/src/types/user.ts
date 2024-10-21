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

export interface UserLogin {
  accessToken: string;
  id: string;
  username: string;
  email: string;
  isAdmin: string;
  createdAt: string;
}
