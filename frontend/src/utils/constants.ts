import { QuestionDifficulty, QuestionLanguages, QuestionTopics } from "@/types/find-match";
import { capitalizeWords } from "@/utils/string_utils";

export const preferredLanguagesList = Object.values(QuestionLanguages).map((ql) => {
  return {
    label: capitalizeWords(ql),
    value: ql,
  };
});


export const topicsList = Object.values(QuestionTopics)
.map((qt) => {
  return {
    label: capitalizeWords(qt),
    value: qt,
  };
})
.sort((a, b) => a.label.localeCompare(b.label));

export const questionDifficulties = Object.values(QuestionDifficulty).map((qd) => {
  return {
    label: capitalizeWords(qd),
    value: qd,
  };
})