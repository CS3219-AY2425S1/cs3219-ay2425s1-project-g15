import { TCombinedSession, TQuestion, TSession } from "@/types/dashboard";

// retrieve from .env
const COLLAB_SERVICE = process.env.NEXT_PUBLIC_COLLAB_SERVICE;
const QUESTION_SERVICE = process.env.NEXT_PUBLIC_QUESTION_SERVICE;

export const getUserHistoryData = async (username: string): Promise<TCombinedSession[]> => {
  const collabUrl = `${COLLAB_SERVICE}/sessions/${username}`;
  const response = await fetch(collabUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const sessionsData = await response.json();
  const questionIds = sessionsData.map((session: TSession) => session.question_id);
  
  const questionUrl = `${QUESTION_SERVICE}/all-ids`;
  const questionResponse = await fetch(questionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ questionIds }),
  });
  const questionsData = await questionResponse.json();

  const combinedData = sessionsData.map((session: TSession) => {
    const question = questionsData.find((question: TQuestion) => question.questionid === session.question_id);
    return {
      // remove self from users
      peer: session.users.filter(user => user !== username)[0],
      ...session,
      ...question,
    };
  });

  return combinedData;
}
