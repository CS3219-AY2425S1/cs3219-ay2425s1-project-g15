"use client";

import { getUserHistoryData } from "@/api/dashboard";
import { getUsername } from "@/api/user";
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
    if (!username) return;
    setUsername(username);
    getUserHistoryData(username).then((userHistory) => {
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
          cardBodyLabel={`${data.length}`}
          cardFooterLabel={`${data.filter(question => question.complexity == "Easy").length} easy, 
            ${data.filter(question => question.complexity == "Medium").length} medium, 
            ${data.filter(question => question.complexity == "Hard").length} hard`}
        />
      </div>
      <DashboardDataTable data={data}/>
    </Container>
  );
};

export default Dashboard;
