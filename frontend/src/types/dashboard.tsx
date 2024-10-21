export interface UserInterviewMetadata {
  completedThisWeek: {
    interviewCount: number;
    dateRangeStart: Date;
    dateRangeEnd: Date;
  };
  latestInterview: {
    latestInterviewPartnerName: string;
    timeTakenFormatted: string; // Formatting to be done in backend
  };
}

export interface SessionHistory {
  peerName: string;
  completedAt: Date;
  questionName: string;
  totalTime: string; // Formatting to be done in backend
  sessionId: number; // Points to a session ID with all required information inside, to be implemented later once we decide what session information to show
}
