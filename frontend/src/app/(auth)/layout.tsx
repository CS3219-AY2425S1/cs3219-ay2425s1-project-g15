"use client";

import { ReactNode, useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, MenuItemStyles } from "react-pro-sidebar";
import { MdHomeFilled } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdSearch } from "react-icons/io";
import { IconType } from "react-icons";
import { RiLogoutBoxLine } from "react-icons/ri";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { googleLogout } from "@react-oauth/google";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

interface SidebarMenuItemProps {
  menuLabel: string;
  menuIcon: IconType;
  linksTo: string;
}

const iconSize = 20;

const SidebarMenuItem = ({
  menuLabel,
  menuIcon: MenuIcon,
  linksTo,
}: SidebarMenuItemProps) => {
  return (
    <MenuItem
      icon={<MenuIcon size={iconSize} />}
      component={<Link href={linksTo} />}
    >
      {menuLabel}
    </MenuItem>
  );
};

const sidebarItems: SidebarMenuItemProps[] = [
  {
    menuLabel: "Home",
    menuIcon: MdHomeFilled,
    linksTo: "/dashboard",
  },
  {
    menuLabel: "Profile",
    menuIcon: CgProfile,
    linksTo: "/profile",
  },
  {
    menuLabel: "Find Match",
    menuIcon: IoMdSearch,
    linksTo: "/find-match",
  },
];

const menuItemStyles: MenuItemStyles = {
  root: {
    color: "#6679A4",
  },
};

const Layout = ({ children }: { children: ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // check if access token is present using Cookies
  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (!access_token && pathname !== "/") {
      router.push("/");
    }
  }, [pathname]);

  const handleLogout = () => {
    googleLogout();
    logout();
    router.push("/");
  }

  return (<div className="flex h-full overflow-y-auto">
      <Sidebar
        className="sticky top-0 h-full"
        rootStyles={{
          borderColor: "#171C28",
        }}
        collapsed={!isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        backgroundColor={"#171C28"}
      >
        <div className="h-full flex flex-col justify-between">
          <Menu menuItemStyles={menuItemStyles}>
            {sidebarItems.map((item, idx) => (
              <SidebarMenuItem
                key={idx}
                menuLabel={item["menuLabel"]}
                menuIcon={item["menuIcon"]}
                linksTo={item["linksTo"]}
              />
            ))}
          </Menu>
          <Menu
            menuItemStyles={menuItemStyles}
            rootStyles={{
              marginBottom: "60px",
            }}
          >
            <MenuItem
              icon={<RiLogoutBoxLine size={iconSize} />}
              onClick={handleLogout}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Sidebar>
      <div className="w-full overflow-y-scroll">{children}</div>
    </div>
  );
};

export default Layout;
