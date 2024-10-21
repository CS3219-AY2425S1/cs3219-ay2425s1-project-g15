"use client";

import Navbar from "@/app/(auth)/home/components/navbar/Navbar";
import LandingPage from "@/app/(auth)/home/components/landing-page/LandingPage";
import { getToken } from "@/api/user";
import { useEffect, useState } from "react";
import FindPeer from "@/app/(auth)/match/page";

const Home = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUserToken(token);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null; //Can render a loading spinner instead
  }
  
  return !!userToken ? (
    <FindPeer />
  ) : (
    <>
      <Navbar />
      <LandingPage />
    </>
  );
};

export default Home;
