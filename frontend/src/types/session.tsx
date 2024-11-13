export interface NewSession {
  collabid: string;
  users: string[];
  question_id: number;
  language: string;
}

export interface SessionFull {
  collabid: string;
  users: string[];
  question_id: number;
  language: string;
  code: string;
}

export interface UpdateSession {
  code: string;
}

export interface SessionExists {
  exists: boolean;
}
