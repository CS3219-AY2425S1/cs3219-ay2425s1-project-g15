import Link from 'next/link'
import Sidebar from './common/Sidebar'

const NotFound = () => {
  return <div className="flex h-full overflow-y-auto">
    <Sidebar/>
    <div className="grid h-screen w-full">
      <div className="mx-auto my-auto grid gap-4">
        <h1 className="text-yellow-500 text-6xl">Oops! 404 Not Found!</h1>
        <p className="text-white text-xl">The page you are looking for does not exist.</p>
        <Link className="me-auto bg-yellow-500 hover:bg-yellow-300 p-2 rounded-lg text-center" href="/dashboard">Go back to Home</Link>
      </div>
    </div>
  </div>
}

export default NotFound;