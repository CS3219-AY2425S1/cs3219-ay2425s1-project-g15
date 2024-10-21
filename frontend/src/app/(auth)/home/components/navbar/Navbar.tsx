import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Update the state with the current pathname on the client side
    setCurrentPath(window.location.pathname);
  }, []);

  const isActive = (path: string) => currentPath === path;
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900">
      <div className="flex-shrink-0">
        <Header />
      </div>

      <div className="flex space-x-6">
        <Link
          href="/"
          className={`text-primary-300 hover:underline ${
            isActive("/") ? "opacity-100" : "opacity-50 hover:opacity-100"
          }`}
        >
          Home
        </Link>
        <Link
          href=""
          className={`text-primary-300 hover:underline ${
            isActive("/about") ? "opacity-100" : "opacity-50 hover:opacity-100"
          }`}
        >
          About Us
        </Link>
        <Link
          href="https://github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g15"
          className="text-primary-300 opacity-50 hover:underline hover:opacity-100"
        >
          Our Codebase
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
