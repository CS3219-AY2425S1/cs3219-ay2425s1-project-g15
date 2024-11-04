import { QuestionAll, QuestionFull, NewQuestionData } from "@/types/find-match";

const QUESTION_SERVICE =
  process.env.NEXT_PUBLIC_QUESTION_SERVICE || "http://35.192.214.143:80/api/question";

export const createSingleQuestion = async (
  data: NewQuestionData
): Promise<QuestionFull> => {
  const url = `${QUESTION_SERVICE}/create`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Check if the response is not OK (e.g., status code 400, 500)
  if (!resp.ok) {
    throw new Error(`Failed to create the question: ${resp.statusText}`);
  }

  // Parse and return the JSON response
  const result: QuestionFull = await resp.json();
  return result;
};

export const getQuestionDashboardData = async (
  pagination: number,
  pageSize: number,
  title: string,
  complexity: string[],
  category: string[]
): Promise<QuestionAll> => {
  const url = `${QUESTION_SERVICE}/all`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pagination: pagination,
      pageSize: pageSize,
      title: title,
      complexity: complexity,
      category: category,
    }),
  });
  const data = await response.json();
  return data;
};

export const fetchSingleQuestion = async (
  questionId: string
): Promise<QuestionFull> => {
  const url = `${QUESTION_SERVICE}/${questionId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const updateSingleQuestion = async ({
  questionId,
  title,
  description,
  category,
  complexity,
}: QuestionFull) => {
  const url = `${QUESTION_SERVICE}/${questionId}/update`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      category: category,
      complexity: complexity,
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to update the question");
  }

  return resp.json();
};

export const deleteSingleQuestion = async (questionId: string) => {
  const url = `${QUESTION_SERVICE}/${questionId}/delete`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      questionId: questionId,
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to update the question");
  }

  return await resp.json();
};
