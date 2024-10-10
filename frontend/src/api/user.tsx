/* eslint-disable */

import { User } from "@/types/user";

export const loginProfile = async (
  access_token: string
): Promise<User> => {
  // GET request
  // url from environment variable
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

export const getProfile = async (
  access_token: string
): Promise<User> => {
  // GET request
  // url from environment variable
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

export const setProfile = async (
  access_token: string,
  user: User
): Promise<User> => {
  const username = user.username;
  const bio = user.bio;
  const linkedin = user.linkedin;
  const github = user.github;

  // POST request
  // url from environment variable
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
