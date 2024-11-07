"use client";

import LandingPage from "@/app/(home)/components/landing-page/LandingPage";
import Sidebar from "./common/Sidebar";

const Home = () => {
  return <div className="flex h-full overflow-y-auto">
    <Sidebar/>
    <div className="p-4"><LandingPage /></div>
  </div>
};

export default Home;
