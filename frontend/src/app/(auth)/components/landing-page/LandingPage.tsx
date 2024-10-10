import { useAuth } from "@/components/auth/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const LandingPage = () => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => login(response),
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    <div className="max-w-6xl mx-auto my-10 p-2">
      <h1 className="text-white font-extrabold text-h1">Peer Prep</h1>
      <p className="text-primary-300 text-lg">
        A platform to prepare for technical interviews.
      </p>
      <button
        onClick={() => googleLogin()}
        className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 my-2 rounded-md"
      >
        Login
      </button>
    </div>
  );
};

export default LandingPage;
