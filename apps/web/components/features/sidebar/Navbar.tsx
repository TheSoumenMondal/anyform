"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SidebarLeft01Icon,
  PanelRightCloseIcon,
  Upload01Icon,
  Archive03Icon,
} from "@hugeicons/core-free-icons";
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
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { CreateFormDialog } from "../form/CreateFormDialog";
import { usePublishForm } from "~/hooks/api/form/use-publish-form";
import { useArchiveForm } from "~/hooks/api/form/use-archive-form";
import { useFormBySlug } from "~/hooks/api/form/use-form-by-slug";
import { useFormFields } from "~/hooks/api/form/use-form-fields";

function formatSegment(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

const Navbar = () => {
  const { toggleSidebar, open } = useSidebar();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const isFormListRoute = pathname === "/form" || pathname === "/dashboard";
  const isFormDetailRoute = pathname.startsWith("/form/") && segments.length >= 2;
  const formSlug = isFormDetailRoute ? segments[1] : null;

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

      {isFormListRoute && <CreateFormDialog />}
      {isFormDetailRoute && formSlug && <PublishButton slug={formSlug} />}
    </header>
  );
};

type PublishButtonProps = {
  slug: string;
};

const PublishButton = ({ slug }: PublishButtonProps) => {
  const { form } = useFormBySlug(slug);
  const { formFields } = useFormFields(form?.id || "");
  const { publishFormAsync, publishFormIsPending } = usePublishForm();
  const { archiveFormAsync, archiveFormIsPending } = useArchiveForm();

  const isPublished = form?.formStatus === "published";

  const handlePublish = async () => {
    if (!form?.id) return;

    if (!formFields || formFields.length === 0) {
      toast.error("Cannot publish form", {
        description: "You must add at least one field to the form before publishing.",
        action: (
          <Button
            className="ml-auto"
            size="sm"
            type="button"
            variant="raised"
            onClick={() => toast.dismiss()}
          >
            Close
          </Button>
        ),
        style: {
          border: "1px solid var(--border)",
          borderStyle: "dashed",
        },
      });
      return;
    }
    try {
      await publishFormAsync({ formId: form.id });
      toast.success("Form published!", {
        description: "Your form is now live.",
        action: (
          <Button
            className="ml-auto"
            size="sm"
            type="button"
            variant="raised"
            onClick={() => toast.dismiss()}
          >
            Close
          </Button>
        ),
        style: {
          border: "1px solid var(--border)",
          borderStyle: "dashed",
        },
      });
    } catch (error) {
      toast.error("Failed to publish", {
        description: error instanceof Error ? error.message : "Please try again.",
        action: (
          <Button
            className="ml-auto"
            size="sm"
            type="button"
            variant="raised"
            onClick={() => toast.dismiss()}
          >
            Close
          </Button>
        ),
        style: {
          border: "1px solid var(--border)",
          borderStyle: "dashed",
        },
      });
    }
  };

  const handleArchive = async () => {
    if (!form?.id) return;
    try {
      await archiveFormAsync({ formId: form.id });
      toast.success("Form moved to draft", {
        description: "You can now edit and make changes.",
        action: (
          <Button
            className="ml-auto"
            size="sm"
            type="button"
            variant="raised"
            onClick={() => toast.dismiss()}
          >
            Close
          </Button>
        ),
        style: {
          border: "1px solid var(--border)",
          borderStyle: "dashed",
        },
      });
    } catch (error) {
      toast.error("Failed to archive", {
        description: error instanceof Error ? error.message : "Please try again.",
        action: (
          <Button
            className="ml-auto"
            size="sm"
            type="button"
            variant="raised"
            onClick={() => toast.dismiss()}
          >
            Close
          </Button>
        ),
        style: {
          border: "1px solid var(--border)",
          borderStyle: "dashed",
        },
      });
    }
  };

  if (isPublished) {
    return (
      <Button variant="warning" size="lg" onClick={handleArchive} disabled={archiveFormIsPending}>
        <HugeiconsIcon icon={Archive03Icon} className="size-3.5 shrink-0" />
        {archiveFormIsPending ? "Archiving..." : "Archive"}
      </Button>
    );
  }

  return (
    <Button variant="info" size="lg" onClick={handlePublish} disabled={publishFormIsPending}>
      <HugeiconsIcon icon={Upload01Icon} className="size-3.5 shrink-0" />
      {publishFormIsPending ? "Publishing..." : "Publish"}
    </Button>
  );
};

export default Navbar;
