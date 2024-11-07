import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-full overflow-y-auto">
      <Sidebar/>
      <div className="w-full">{children}</div>
    </div>
  );
}

export default Layout;