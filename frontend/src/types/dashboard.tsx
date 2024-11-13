export type TSession = {
  collabid: string;
  users: [string];
  language: [string];
  question_id: number;
};

export type TQuestion = {
  questionid: number;
  title: string;
  complexity: string;
  category: string;
};

export type TCombinedSession = {
  collabid: string;
  peer: string;
  language: [string];
  question_id: number;
  title: string;
  complexity: string;
  category: string;
  createdAt: Date;
};
