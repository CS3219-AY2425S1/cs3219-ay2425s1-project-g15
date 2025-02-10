import { SidebarMenuItemProps } from "@/types/sidebar";
import Link from "next/link";

const SidebarItem = ({ item }: {item: SidebarMenuItemProps}) => {
  return <Link className={`group grid text-primary-500 p-2 hover:bg-primary-700`} href={item.linksTo} key={item.menuLabel}>
    <item.menuIcon size={30} className="mx-auto"/>
    <p className="text-center text-[12px]">{item.menuLabel}</p>
  </Link>;
}

export default SidebarItem;