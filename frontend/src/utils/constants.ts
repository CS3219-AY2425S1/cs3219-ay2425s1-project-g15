import { QuestionLanguages, QuestionTopics } from "@/types/find-match";

export const preferredLanguagesList = Object.values(QuestionLanguages).map(
    (ql) => {
      return {
        label: ql,
        value: ql,
      };
    }
  );
  
  export const topicsList = Object.values(QuestionTopics).map((qt) => {
    return {
      label: qt,
      value: qt,
    };
  });