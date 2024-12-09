"use client";

import LandingPage from "@/app/(home)/components/landing-page/LandingPage";
import Sidebar from "./common/Sidebar";

const Home = () => {
  return (
    <div className="flex flex-row h-full">
      <Sidebar />
      <LandingPage />
    </div>
  );
};

export default Home;
