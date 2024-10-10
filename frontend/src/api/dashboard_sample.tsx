import { SessionHistory, UserInterviewMetadata } from "@/types/dashboard";

export const DashboardUserInterviewMetadataExample: UserInterviewMetadata = {
  completedThisWeek: {
    dateRangeStart: new Date(2024, 9, 16),
    dateRangeEnd: new Date(2024, 9, 22),
    interviewCount: 69,
  },
  latestInterview: {
    latestInterviewPartnerName: "Mai Ting",
    timeTakenFormatted: "3h 15 min", // Formatting to be done in backend
  },
};

export const DashboardUserHistoryExample: SessionHistory[] = [
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Ting",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Kai",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Kai",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Kai",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
  {
    peerName: "Mai Kai",
    completedAt: new Date(2024, 9, 16, 19, 3),
    questionName: "Two Sum",
    totalTime: "3h 15 min",
    sessionId: 10,
  },
];
