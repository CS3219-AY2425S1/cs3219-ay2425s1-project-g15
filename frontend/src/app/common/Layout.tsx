import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default Layout;
