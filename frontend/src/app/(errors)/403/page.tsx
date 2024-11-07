import Link from 'next/link'

const Error403Page = () => {
  return <div className="grid h-screen">
    <div className="mx-auto my-auto grid gap-4">
      <h1 className="text-yellow-500 text-6xl">Oops! 403 Forbidden!</h1>
      <p className="text-white text-xl">You are not allowed to access this page.</p>
      <Link className="me-auto bg-yellow-500 hover:bg-yellow-300 p-2 rounded-lg text-center" href="/dashboard">Go back to Home</Link>
    </div>
  </div>
}

export default Error403Page