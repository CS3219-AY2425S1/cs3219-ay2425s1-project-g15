export enum AuthStatus {
  LOADING = "LOADING",
  UNAUTHENTICATED = "UNAUTHENTICATED",
  AUTHENTICATED = "AUTHENTICATED",
  ADMIN = "ADMIN",
}

export interface AttemptedQuestion {
  title: string;
  peer: string;
  tags: string[];
  date: string;
}

export interface User {
  id?: string;
  username?: string;
  profilePictureUrl?: string;
  email?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  createdAt?: string;
  isVerified?: boolean;
}

export interface UserLogin {
  accessToken: string;
  id: string;
  username: string;
  email: string;
  isAdmin: string;
  createdAt: string;
}

export interface UploadProfilePictureResponse {
  fileUrl: string;
}
