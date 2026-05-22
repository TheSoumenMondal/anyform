"use client";

import * as React from "react";
import { Copy01Icon, Download01Icon, QrCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useSnapQR, { type SnapQROptions } from "snap-qr";
import { toast } from "sonner";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Image from "next/image";

const getQrFileName = (formTitle: string) =>
  `${
    formTitle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "form"
  }-qr`;

type QrDialogProps = {
  formId: string;
  formTitle: string;
};

const QrDialog = ({ formId, formTitle }: QrDialogProps) => {
  const { resolvedTheme } = useTheme();

  const currentQrOptions = React.useMemo<SnapQROptions>(() => {
    const isDark = resolvedTheme === "dark";
    const foreground = isDark ? "#ffffff" : "#18181b";

    return {
      layoutOptions: {
        type: "svg",
        width: 320,
        height: 320,
        margin: 10,
      },
      qrOptions: {
        errorCorrectionLevel: "Q",
      },
      dotsOptions: {
        type: "rounded",
        color: foreground,
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: foreground,
      },
      cornersDotOptions: {
        type: "dot",
        color: foreground,
      },
      backgroundOptions: {
        color: "transparent",
      },
    };
  }, [resolvedTheme]);

  const formPath = `/fill/${formId}`;
  const [formUrl, setFormUrl] = React.useState(formPath);
  const [isCopied, setIsCopied] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);

  const { onDownloadClick, updateData, getRawData, updateOptions } = useSnapQR(
    formUrl,
    currentQrOptions,
  );

  React.useEffect(() => {
    updateOptions(currentQrOptions);
  }, [currentQrOptions, updateOptions]);

  React.useEffect(() => {
    setFormUrl(new URL(formPath, window.location.origin).toString());
  }, [formPath]);

  React.useEffect(() => {
    updateData(formUrl);
  }, [formUrl, updateData]);

  React.useEffect(() => {
    let active = true;
    let url = "";

    const generateQr = async () => {
      try {
        const blob = await getRawData("svg");
        if (active && blob) {
          url = URL.createObjectURL(blob as Blob);
          setImgSrc(url);
        }
      } catch (error) {
        toast.error("Error", {
          description: error instanceof Error ? error.message : "Could not generate QR code.",
          action: (
            <Button
              className="ml-auto"
              size="sm"
              type="button"
              variant="info"
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

    generateQr();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [getRawData]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setIsCopied(true);
      toast.success("QR link copied", {
        description: "The link has been copied to your clipboard.",
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
      window.setTimeout(() => setIsCopied(false), 1500);
    } catch {
      toast.error("Could not copy QR link");
    }
  };

  const handleDownload = () => {
    onDownloadClick({
      name: getQrFileName(formTitle),
      extension: "png",
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            animation="none"
            type="button"
            variant="info"
            size="icon-lg"
            aria-label={`Open QR code for ${formTitle}`}
          >
            <HugeiconsIcon icon={QrCodeIcon} className="size-3.5" />
          </Button>
        }
      />
      <DialogPopup className="sm:max-w-md" containerClassName="gap-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-instrumental-serif text-3xl font-bold">
            Form QR Code
          </DialogTitle>
          <DialogDescription className="text-sm">
            Scan this QR code to open {formTitle}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border border-dashed shadow-xs bg-background">
            <div className="flex size-56 items-center justify-center sm:size-64 overflow-hidden relative">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={`QR Code for ${formTitle}`}
                  fill
                  unoptimized
                  className="object-contain p-4"
                />
              ) : (
                <div className="absolute inset-0 h-full w-full animate-pulse rounded-xl bg-muted/50 m-4" />
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="justify-end">
          <Button type="button" variant="secondary" onClick={handleDownload}>
            <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
            Download
          </Button>
          <Button type="button" variant="info" onClick={handleCopyLink}>
            <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
            {isCopied ? "Copied" : "Copy link"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};

export default QrDialog;
