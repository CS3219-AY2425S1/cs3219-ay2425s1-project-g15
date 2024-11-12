/* eslint-disable react/no-unescaped-entities */
"use client";

import { getUserHistoryData } from "@/api/dashboard";
import { getUserId, getUsername } from "@/api/user";
import Container from "@/components/ui/Container";
import { TCombinedSession } from "@/types/dashboard";
import { useEffect, useState } from "react";
import DashboardCard from "@/app/(user)/dashboard/components/DashboardCard";
import { DashboardDataTable } from "@/app/(user)/dashboard/components/DashboardDataTable";

const Dashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [data, setData] = useState<TCombinedSession[]>([]);

  useEffect(() => {
    const username = getUsername();
    const userId = getUserId();
    if (!username) return;
    if (!userId) return;
    setUsername(username);
    getUserHistoryData(userId).then((userHistory) => {
      setData(userHistory);
    });
  }, []);

  return (
    <Container className="flex flex-col gap-y-5">
      <div className="flex flex-col mt-8">
        <span className="text-h3 font-medium text-white">
          {username}'s Dashboard
        </span>
        <div className="flex flex-col text-white text-lg font-light">
          <span>
            Checkout your past interview sessions and questions attempted!
          </span>
        </div>
      </div>
      <div className="flex flex-row w-full gap-8">
        <DashboardCard
          cardTitleLabel="Questions Attempted"
          cardBodyLabels={[
            `${
              data.filter((question) => question.complexity == "Easy").length
            }`,
            `${
              data.filter((question) => question.complexity == "Medium").length
            }`,
            `${
              data.filter((question) => question.complexity == "Hard").length
            }`,
          ]}
          cardFooterLabels={["Easy", "Medium", "Hard"]}
        />
      </div>
      <DashboardDataTable data={data} />
    </Container>
  );
};

export default Dashboard;
