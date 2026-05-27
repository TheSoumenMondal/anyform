"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
      <div className="w-full max-w-5xl mx-auto h-12 border-b flex justify-between items-center px-2 md:px-4 border-x">
        <div className="font-mono text-sm">anyform</div>
        <div>
          <Button
            onClick={() => router.push("/login")}
            size="default"
            animation="none"
            variant="info"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
