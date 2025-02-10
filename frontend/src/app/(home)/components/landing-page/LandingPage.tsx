import CodeSnippet from "@/app/(home)/components/code-snippet/CodeSnippetHighlight";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/app/common/Navbar";
import { getAuthStatus } from "@/api/user";
import { AuthStatus } from "@/types/user";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    AuthStatus.UNAUTHENTICATED
  );

  useEffect(() => {
    setAuthStatus(getAuthStatus());
  }, []);

  const handleRedirect = () => {
    if (authStatus === AuthStatus.UNAUTHENTICATED) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <div className="grid grid-cols-[1.45fr,1.55fr] gap-10 h-full items-center justify-center pl-10 pr-10">
        <div className="">
          <h1 className="text-6xl font-extrabold text-white pb-8">
            Collaborative Coding, <br></br> Competitive Results.
          </h1>
          <p className="font-normal text-white pb-8 text-lg">
            Join PeerPrep to sharpen your skills through real-time
            problem-solving, and prepare to outshine in every interview. Created
            for CS3219 Software Engineering Principles AY24/25 by Group 15.
          </p>
          <div className="pt-8">
            <Button
              className="font-semibold w-full"
              onClick={() => handleRedirect()}
            >
              <span className="pl-2">
                {authStatus === AuthStatus.UNAUTHENTICATED
                  ? "Get Started"
                  : "View Dashboard"}
              </span>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-items-center h-full">
          <CodeSnippet />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
