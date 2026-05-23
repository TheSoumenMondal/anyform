"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "~/components/features/sidebar/AppSidebar";
import Navbar from "~/components/features/sidebar/Navbar";
import { SidebarProvider } from "~/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const pathname = usePathname();
  const isFormDetailRoute =
    pathname.startsWith("/form/") && pathname.split("/").filter(Boolean).length >= 2;

  return (
    <SidebarProvider defaultOpen={!isFormDetailRoute}>
      <AppSidebar />
      <main className="flex w-full flex-col max-h-screen pl-0">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-2">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
