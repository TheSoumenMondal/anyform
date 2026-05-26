"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  AnalyticsUpIcon,
  DashboardBrowsingIcon,
  LicenseDraftIcon,
  StoreAdd02Icon,
  Trash2,
} from "@hugeicons/core-free-icons";
import FlowerLogo from "~/components/common/flower";
import { ThemeToggle } from "~/components/common/Theme-Toggle";

import { NavUser } from "./NavUser";

type IconSvgObject =
  | [string, { [key: string]: string | number }][]
  | readonly (readonly [string, { readonly [key: string]: string | number }])[];

type SidebarItem = {
  label: string;
  url: string;
  icon: IconSvgObject;
};

const data: SidebarItem[] = [
  {
    label: "Dashboard",
    url: "/dashboard",
    icon: DashboardBrowsingIcon,
  },
  {
    label: "Form",
    url: "/form",
    icon: LicenseDraftIcon,
  },
  {
    label: "Trash",
    url: "/trash",
    icon: Trash2,
  },
  {
    label: "Analytics",
    url: "/analytics",
    icon: AnalyticsUpIcon,
  },
  {
    label: "Templates",
    url: "/templates",
    icon: StoreAdd02Icon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="flex flex-row items-start justify-start gap-2 px-3 pt-4">
        <FlowerLogo className="size-6 shrink-0" />
        <p className="font-serif group-data-[collapsible=icon]:hidden">anyform</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                  tooltip={item.label}
                >
                  <Link href={item.url}>
                    <HugeiconsIcon icon={item.icon} className="size-10 shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
