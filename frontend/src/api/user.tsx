/* eslint-disable */

import { AuthStatus, UploadProfilePictureResponse } from "@/types/user";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

export const ToastComponent = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const setToken = (token: string) => {
  Cookie.set("token", token, { expires: 1 });
};

export const getToken = () => {
  return Cookie.get("token");
};

export const setUsername = (username: string) => {
  Cookie.set("username", username, { expires: 1 });
};

export const getUsername = () => {
  return Cookie.get("username");
};

export const setUserId = (id: string) => {
  Cookie.set("id", id, { expires: 1 });
};

export const getUserId = () => {
  return Cookie.get("id");
};

export const setIsAdmin = (isAdmin: boolean) => {
  Cookie.set("isAdmin", isAdmin ? "Y" : "N", { expires: 1 });
};

export const getIsAdmin = (): boolean => {
  return Cookie.get("isAdmin") == "Y";
};

export const getAuthStatus = () => {
  if (!getToken()) return AuthStatus.UNAUTHENTICATED;
  if (getIsAdmin()) return AuthStatus.ADMIN;
  return AuthStatus.AUTHENTICATED;
};

const NEXT_PUBLIC_IAM_USER_SERVICE = process.env.NEXT_PUBLIC_IAM_USER_SERVICE;

const NEXT_PUBLIC_IAM_AUTH_SERVICE = process.env.NEXT_PUBLIC_IAM_AUTH_SERVICE;

export const verifyToken = async (token: string) => {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_IAM_AUTH_SERVICE}/verify-token`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) {
      Cookie.remove("token");
      Cookie.remove("username");
      Cookie.remove("id");
      Cookie.remove("isAdmin");
      return false;
    }

    const data = await response.json();
    setUsername(data.data.username);
    setIsAdmin(data.data.isAdmin);
    setUserId(data.data.id);
    return response.status === 200;
  } catch (e) {
    console.error(e);
  }
};

export const login = async (email: string, password: string) => {
  ToastComponent.fire({
    icon: "info",
    title: "Logging in...",
  });
  const response = await fetch(`${NEXT_PUBLIC_IAM_AUTH_SERVICE}/login`, {
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

  if (response.status !== 200) {
    ToastComponent.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  setToken(data.data.accessToken);
  setUsername(data.data.username);
  setIsAdmin(data.data.isAdmin);
  setUserId(data.data.id);

  return true;
};

export const logout = () => {
  Cookie.remove("token");
  Cookie.remove("username");
  Cookie.remove("id");
  Cookie.remove("isAdmin");

  window.location.href = "/";
};

export const register = async (
  email: string,
  password: string,
  username: string
) => {
  ToastComponent.fire({
    icon: "info",
    title: "Registering...",
  });
  const response = await fetch(`${NEXT_PUBLIC_IAM_USER_SERVICE}`, {
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

  if (response.status !== 201) {
    ToastComponent.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  return true;
};

// optional userId parameter
export const getUser = async (userId = "") => {
  const token = getToken();
  const url = `${NEXT_PUBLIC_IAM_USER_SERVICE}/${userId || getUserId()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (response.status !== 200) {
    ToastComponent.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  return data;
};

export const updateUser = async (userData: {
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  profilePictureUrl?: string;
}) => {
  const token = getToken();
  const userId = getUserId();
  const response = await fetch(`${NEXT_PUBLIC_IAM_USER_SERVICE}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  console.log(data);

  if (response.status !== 200) {
    ToastComponent.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  ToastComponent.fire({
    icon: "success",
    title: "Profile updated successfully",
  });

  return true;
};

export const getFileUrl = async (
  userId: string,
  formData: FormData
): Promise<UploadProfilePictureResponse> => {
  const res = await fetch(
    `${NEXT_PUBLIC_IAM_USER_SERVICE}/${userId}/getFileUrl`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    }
  );

  const data: UploadProfilePictureResponse = await res.json();

  if (res.status !== 200) {
    ToastComponent.fire({
      icon: "error",
      title: res.statusText,
    });
    throw new Error("Failed to upload profile picture: " + res.statusText);
  }
  return data;
};

export const requestPasswordReset = async (email: string) => {
  ToastComponent.fire({
    icon: "info",
    title: "Requesting password reset...",
  });
  const response = await fetch(
    `${NEXT_PUBLIC_IAM_USER_SERVICE}/request-password-reset`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );
  const data = await response.json();
  console.log(data);

  if (response.status !== 200) {
    ToastComponent.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  ToastComponent.fire({
    icon: "success",
    title: "Password reset requested. Please check your email.",
  });

  return true;
};

export const checkPasswordResetCode = async (code: string) => {
  const response = await fetch(
    `${NEXT_PUBLIC_IAM_USER_SERVICE}/check-password-reset-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }
  );
  const data = await response.json();

  if (response.status !== 200) {
    ToastComponent.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  return { username: data.username };
};

export const resetPasswordWithCode = async (code: string, password: string) => {
  const response = await fetch(
    `${NEXT_PUBLIC_IAM_USER_SERVICE}/password-reset`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, password }),
    }
  );
  const data = await response.json();

  if (response.status !== 200) {
    ToastComponent.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  return true;
};
