import Link from "next/link";

const VerifiedPage = () => {
  return (
    <div className="w-full h-screen grid">
      <div className="mx-auto my-auto">
        <h1 className="text-3xl text-yellow-500">Verified!</h1>
        <p className="text-white my-4 text-lg">Thank you for verifying your email! Welcome to PeerPrep!</p>
        <Link href="/dashboard" className="bg-yellow-500 p-2 rounded-lg">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default VerifiedPage;