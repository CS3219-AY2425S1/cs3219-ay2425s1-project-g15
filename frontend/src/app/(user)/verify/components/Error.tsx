import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="w-full h-screen grid">
      <div className="mx-auto my-auto">
        <h1 className="text-3xl text-yellow-500">Error!</h1>
        <p className="text-white my-4 text-lg">Oops... It seems something went wrong when verifying your email...</p>
        <Link href="/dashboard" className="bg-yellow-500 p-2 rounded-lg">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default ErrorPage;