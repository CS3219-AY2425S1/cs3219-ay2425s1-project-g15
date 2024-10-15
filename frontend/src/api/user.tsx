/* eslint-disable */

import { User } from "@/types/user";

// pings the backend that the user has logged in with Google
export const loginProfile = async (
  access_token: string
): Promise<User> => {
  const url = process.env.NEXT_PUBLIC_USER_SERVICE + "/login";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: `${access_token}`,
    },
  });

  return response.json();
}

// get basic user information
export const getProfile = async (
  access_token: string
): Promise<User> => {
  const url = process.env.NEXT_PUBLIC_USER_SERVICE + "/get";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: `${access_token}`,
    },
  });

  return response.json();
};

// update user profile
export const setProfile = async (
  access_token: string,
  user: User
): Promise<User> => {
  const username = user.username;
  const bio = user.bio;
  const linkedin = user.linkedin;
  const github = user.github;

  const url = process.env.NEXT_PUBLIC_USER_SERVICE + "/update";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: `${access_token}`,
    },
    body: JSON.stringify({
      username,
      bio,
      linkedin,
      github,
    }),
  });

  return response.json();
};
