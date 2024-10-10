/* eslint-disable */

import { User } from "@/types/user";

export const setGetProfile = async (
  access_token: string,
  user: User
): Promise<User> => {
  // const username = user.username;
  // const bio = user.bio;
  // const linkedin = user.linkedin;
  // const github = user.github;

  // POST request
  // url from environment variable
  // const url = process.env.REACT_APP_USER_URL + "/";
  // const response = await fetch(url, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${access_token}`,
  //   },
  //   body: JSON.stringify({
  //     username,
  //     bio,
  //     linkedin,
  //     github,
  //   }),
  // });

  // return response.json();
  return {
    username: "Hong Shan",
    bio: "I live in Redhill",
    linkedin: "www.linkedin.com/in/hongshan",
    github: "www.github.com/hongshan",
  };
};
