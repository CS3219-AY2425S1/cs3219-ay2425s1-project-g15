import {
  DashboardUserHistoryExample,
  DashboardUserInterviewMetadataExample,
} from "@/api/dashboard_sample";
import { SessionHistory, UserInterviewMetadata } from "@/types/dashboard";

export const getUserInterviewMetadata = (): UserInterviewMetadata => {
  return DashboardUserInterviewMetadataExample;
};

export const getUserHistory = (): SessionHistory[] => {
  return DashboardUserHistoryExample;
};
