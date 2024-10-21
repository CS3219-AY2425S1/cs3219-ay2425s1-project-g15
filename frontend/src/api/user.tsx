/* eslint-disable */

import toast from "@/components/modals/toast";
import { UserLogin } from "@/types/user";
import Cookie from "js-cookie";

export const setToken = (token: string) => {
  Cookie.set("token", token, { expires: 1 });
};

export const getToken = () => {
  return Cookie.get("token");
};

export const setBaseUserData = (data: {
  username: string;
  id: string;
  isAdmin: string;
}) => {
  Cookie.set("username", data.username, { expires: 1 });
  Cookie.set("id", data.id, { expires: 1 });
  Cookie.set("isAdmin", data.isAdmin, { expires: 1 });
};

export const getBaseUserData = () => {
  return {
    username: Cookie.get("username"),
    id: Cookie.get("id"),
    isAdmin: Cookie.get("isAdmin"),
  };
};

const NEXT_PUBLIC_USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE || "https://user-service-598285527681.us-central1.run.app";

export const verifyToken = async (needsLogin: boolean) => {
  const token = getToken();
  if (!token) {
    if (needsLogin) logout();
    return false;
  }

  const response = await fetch(
    `${NEXT_PUBLIC_USER_SERVICE}/auth/verify-token`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  switch (response.status) {
    case 200:
      return true;
    case 401:
      return false;
    default:
      return false;
  }
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await response.json();

  switch (response.status) {
    case 200:
      handleSuccessfulLogin(data.data);
      break;
    case 401:
      toast.fire({
        icon: "error",
        title: "Invalid email or password",
      });
      break;
    default:
      toast.fire({
        icon: "error",
        title: "An error occurred while logging in",
      });
  }
};

export const handleSuccessfulLogin = async (data: UserLogin) => {
  const { accessToken, username, id, isAdmin } = data;
  setBaseUserData({ username, id, isAdmin });
  setToken(accessToken);
  const redirect = Cookie.get("redirect");
  if (!redirect) {
    window.location.href = "/";
    return;
  }

  Cookie.remove("redirect");
  window.location.href = redirect;
  return;
};

export const redirectToLogin = async () => {
  Cookie.set("redirect", window.location.pathname, { expires: 1 });
  window.location.href = "/login";
};

export const logout = () => {
  Cookie.remove("token");
  Cookie.remove("username");
  Cookie.remove("id");
  Cookie.remove("isAdmin");
  redirectToLogin();
};

export const register = async (
  email: string,
  password: string,
  username: string
) => {
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: password,
      username,
    }),
  });
  const data = await response.json();

  switch (response.status) {
    case 201:
      return handleSuccessfulLogin(data.data);
    case 400:
      toast.fire({
        icon: "error",
        title: "Invalid email or password",
      });
      break;
    case 409:
      toast.fire({
        icon: "error",
        title: "User already exists",
      });
      break;
    default:
      toast.fire({
        icon: "error",
        title: "An error occurred while registering",
      });
  }
};

export const getUser = async () => {
  const token = getToken();
  const { id } = getBaseUserData();
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  switch (response.status) {
    case 200:
      return await response.json();
    case 401:
      logout();
      break;
    default:
      toast.fire({
        icon: "error",
        title: "An error occurred while fetching your profile",
      });
  }
};

export const updateUser = async (data: {
  email: string;
  password: string;
  bio: string;
  linkedin: string;
  github: string;
}) => {
  const token = getToken();
  const { id } = getBaseUserData();
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  switch (response.status) {
    case 200:
      return response;
    case 400:
      toast.fire({
        icon: "error",
        title: "Invalid data",
      });
      break;
    default:
      toast.fire({
        icon: "error",
        title: "An error occurred while updating your profile",
      });
  }
};
