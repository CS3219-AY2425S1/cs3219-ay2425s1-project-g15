import { getUserInterviewMetadata } from "@/api/dashboard";
import DashboardCard from "@/app/(auth)/components/dashboard/DashboardCard";
import { DashboardDataTable } from "@/app/(auth)/components/dashboard/DashboardDataTable";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { UserInterviewMetadata } from "@/types/dashboard";
import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";

const initialUserInterviewMetaData: UserInterviewMetadata = {
  completedThisWeek: {
    interviewCount: 0,
    dateRangeStart: new Date(),
    dateRangeEnd: new Date(),
  },
  latestInterview: {
    latestInterviewPartnerName: "",
    timeTakenFormatted: "",
  },
};

const AuthDashboard = () => {
  const { token } = useAuth();

  const [userInterviewMetadata, setUserInterviewMetadata] =
    useState<UserInterviewMetadata>(initialUserInterviewMetaData);

  useEffect(() => {
    if (!token) return;
    setUserInterviewMetadata(getUserInterviewMetadata());
  }, [token]);

  const dateFormattingOption: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return (
    <Container className="flex flex-col gap-y-5">
      <div className="flex flex-row w-full gap-8">
        <DashboardCard
          cardTitleLabel="Completed This Week"
          cardBodyLabel={`${userInterviewMetadata?.completedThisWeek.interviewCount} Interviews`}
          cardFooterLabel={`${userInterviewMetadata?.completedThisWeek.dateRangeStart.toLocaleDateString(
            "en-US",
            dateFormattingOption
          )} - ${userInterviewMetadata?.completedThisWeek.dateRangeEnd.toLocaleDateString(
            "en-US",
            dateFormattingOption
          )}`}
        />
        <DashboardCard
          cardTitleLabel="Latest Interview With"
          cardBodyLabel={`${userInterviewMetadata?.latestInterview.latestInterviewPartnerName}`}
          cardFooterLabel={`You collaborated for ${userInterviewMetadata?.latestInterview.timeTakenFormatted}`}
        />
        <Button className="w-full self-end flex gap-3" size={"lg"}>
          <IoMdSearch />
          <span>Find Interview Peer</span>
        </Button>
      </div>
      <DashboardDataTable />
    </Container>
  );
};

export default AuthDashboard;
