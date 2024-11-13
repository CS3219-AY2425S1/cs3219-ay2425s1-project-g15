import Link from "next/link";

const AlreadyVerifiedPage = () => {
  return (
    <div className="w-full h-screen grid">
      <div className="mx-auto my-auto">
        <h1 className="text-3xl text-yellow-500">Already Verified!</h1>
        <p className="text-white my-4 text-lg">It seems you have already verified your email...</p>
        <Link href="/dashboard" className="bg-yellow-500 p-2 rounded-lg">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default AlreadyVerifiedPage;