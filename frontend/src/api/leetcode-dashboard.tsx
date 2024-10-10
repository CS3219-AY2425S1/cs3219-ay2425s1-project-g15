import {
  QuestionMinified,
  QuestionFull,
  NewQuestionData,
} from "@/types/find-match";

const QUESTION_SERVICE =
  process.env.NEXT_PUBLIC_QUESTION_SERVICE ||
  "https://question-service-598285527681.us-central1.run.app/api";

export const createSingleLeetcodeQuestion = async (
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

export const getLeetcodeDashboardData = async (): Promise<
  QuestionMinified[]
> => {
  const url = `${QUESTION_SERVICE}/all`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const fetchSingleLeetcodeQuestion = async (
  questionId: string
): Promise<QuestionFull> => {
  const url = `${QUESTION_SERVICE}/${questionId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const updateSingleLeetcodeQuestion = async ({
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

export const deleteSingleLeetcodeQuestion = async (questionId: string) => {
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
