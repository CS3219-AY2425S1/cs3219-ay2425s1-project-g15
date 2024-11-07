import { IconType } from "react-icons";
import { AuthStatus } from "./user";

interface SidebarMenuItemProps {
  menuLabel: string;
  menuIcon: IconType;
  linksTo: string;
  authStatus: AuthStatus | null;
}

export type { SidebarMenuItemProps };