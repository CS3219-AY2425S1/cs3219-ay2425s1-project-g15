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
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaCode } from "react-icons/fa";

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
    linksTo: "/",
  },
  {
    menuLabel: "Profile",
    menuIcon: CgProfile,
    linksTo: "/profile",
  },
  {
    menuLabel: "Find Match",
    menuIcon: IoMdSearch,
    linksTo: "/match",
  },
  {
    menuLabel: "LeetCode Dashboard",
    menuIcon: FaCode,
    linksTo: "/leetcode-dashboard",
  },
];

const menuItemStyles: MenuItemStyles = {
  root: {
    color: "#6679A4",
  },
};

const Layout = ({ children }: { children: ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { token, login, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => login(response),
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  // check if access token is present using Cookies
  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (!access_token) {
      Swal.fire({
        title: "Access Denied",
        text: "You need to sign in to use this feature!",
        icon: "error",
        showDenyButton: true,
        confirmButtonText: "Sign in with Google",
        denyButtonText: "Nevermind",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          googleLogin();
          return;
        }
        router.push("/");
      });
    }
  }, [pathname, googleLogin, router]);

  const handleLogout = () => {
    googleLogout();
    logout();
    router.push("/");
  };

  return (
    <div className="flex h-full overflow-y-auto">
      {token && <Sidebar
        className="sticky top-0 h-screen"
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
          {token && <Menu
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
          }
        </div>
      </Sidebar>}
      <div className="w-full overflow-y-scroll">{children}</div>
    </div>
  );
};

export default Layout;
