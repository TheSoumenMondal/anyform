"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { SidebarLeft01Icon, PanelRightCloseIcon } from "@hugeicons/core-free-icons";
import { useSidebar } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

import { CreateFormDialog } from "../form/CreateFormDialog";

function formatSegment(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

const Navbar = () => {
  const { toggleSidebar, open } = useSidebar();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isFormRoute = pathname === "/form" || pathname.startsWith("/form/");

  return (
    <header className="sticky top-0 z-20 flex h-12 w-full shrink-0 items-center justify-between gap-2 rounded-t-lg border-b border-border bg-background/80 backdrop-blur-md px-3 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <HugeiconsIcon
            icon={open ? SidebarLeft01Icon : PanelRightCloseIcon}
            className="size-4 shrink-0"
          />
        </button>
        <Separator orientation="vertical" className="mr-1 h-4!" />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/");
              const isLast = index === segments.length - 1;
              return (
                <React.Fragment key={href}>
                  {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="hidden md:block">
                        {formatSegment(segment)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {isFormRoute && <CreateFormDialog />}
    </header>
  );
};

export default Navbar;
