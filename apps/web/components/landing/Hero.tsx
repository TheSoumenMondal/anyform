"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleArrowUpRightIcon } from "@hugeicons/core-free-icons";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col justify-center gap-5 pt-20">
      <p className="font-cormorant-garamond text-4xl md:text-5xl font-bold max-w-md px-4 leading-tight">
        Build forms people actually enjoy filling
      </p>
      <div className="text-lg font-sans max-w-lg px-4 flex gap-2 items-end">
        <p>Create modern, customizable forms in seconds, analytics, and sharing.</p>
      </div>
      <div className="px-4 flex gap-4 mb-10">
        <Button
          className="max-w-fit"
          size="lg"
          animation="none"
          variant="raised"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard <HugeiconsIcon icon={CircleArrowUpRightIcon} />
        </Button>
        <Button
          className="max-w-fit"
          size="lg"
          animation="none"
          variant="info"
          onClick={() => router.push("/login")}
        >
          Get Started <HugeiconsIcon icon={CircleArrowUpRightIcon} />
        </Button>
      </div>
      <div className="w-full relative min-h-30 sm:min-h-35 md:min-h-70 lg:min-h-80 border-y p-2.5 bg-card">
        <div className="w-full relative min-h-30 sm:min-h-35 md:min-h-70 lg:min-h-80 ">
          <Image
            alt="hero-image"
            src="/images/landing/hero-image.png"
            fill
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
