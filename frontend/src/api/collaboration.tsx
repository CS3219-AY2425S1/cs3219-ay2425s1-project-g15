import { NewSession, SessionExists, SessionFull } from "@/types/session";

const COLLABORATION_SERVICE = "http://34.54.37.142/api/collaboration";

export const createSession = async (data: NewSession): Promise<SessionFull> => {
  const url = `${COLLABORATION_SERVICE}/create`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Check if the response is not OK (e.g., status code 400, 500)
  if (!resp.ok) {
    throw new Error(`Failed to create the session: ${resp.statusText}`);
  }

  // Parse and return the JSON response
  const result: SessionFull = await resp.json();
  return result;
};

export const fetchSession = async (collabid: string): Promise<SessionFull> => {
  const url = `${COLLABORATION_SERVICE}/${collabid}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const checkSession = async (
  collabid: string
): Promise<SessionExists> => {
  const url = `${COLLABORATION_SERVICE}/${collabid}/check`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const checkUserInSession = async (
  collabid: string,
  userId: string,
  username: string
): Promise<SessionExists> => {
  const url = `${COLLABORATION_SERVICE}/${collabid}/check/${userId}/${username}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const updateSession = async (
  collabid: string,
  code: string
): Promise<SessionFull> => {
  const url = `${COLLABORATION_SERVICE}/${collabid}/update`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collabid: collabid,
      code: code,
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to update the session");
  }

  return resp.json();
};

export const updateSessionLanguage = async (
  collabid: string,
  language: string
): Promise<SessionFull> => {
  const url = `${COLLABORATION_SERVICE}/${collabid}/updateLanguage`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: language
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to update the session");
  }

  return resp.json();
};

export const deleteSessionById = async (
  collabid: string
): Promise<SessionFull> => {
  const url = `${COLLABORATION_SERVICE}/${collabid}`;
  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    const errorData = await resp.json();
    throw new Error(errorData.message || "Failed to delete session");
  }

  return resp.json();
};
