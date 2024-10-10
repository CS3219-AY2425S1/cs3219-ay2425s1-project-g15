"use client";

import { useAuth } from "@/components/auth/AuthContext";
import LandingPage from "./components/landing-page/LandingPage";
// import Dashboard from "./components/dashboard/Dashboard";
import LeetcodeDashboard from "./leetcode-dashboard/LeetcodeDashboard";

const Home = () => {
  const { token } = useAuth();

  return (
    token ? <LeetcodeDashboard/> : <LandingPage/>
  );
};

export default Home;
