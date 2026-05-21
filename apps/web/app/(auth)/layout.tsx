"use client";
import * as React from "react";
import AuthLayoutIllustration from "~/components/features/auth/AuthLayoutIllustration";
import { Button } from "~/components/ui/button";
import IllustrationDemo from "~/components/features/auth/MultiStepFormDemo";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className=" h-screen flex items-center justify-center overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-170 h-full w-full max-w-6xl">
        <div className="lg:flex items-center justify-center p-4 relative hidden">
          <div className="w-full h-full absolute inset-0 z-0 ">
            <AuthLayoutIllustration />
          </div>
          <div className="w-full h-full absolute inset-0 z-10 p-8 flex items-center justify-center bg-transparent backdrop-blur-md rounded-xl">
            <div className="w-full max-w-sm bg-card dark:bg-neutral-300 border rounded-2xl overflow-hidden p-2">
              <div className="w-full bg-neutral-100 rounded-xl border p-4">
                <div className="flex items-center justify-center w-full">
                  <IllustrationDemo />
                </div>
                <h1 className="text-3xl font-instrumental-serif flex text-neutral-950">
                  Build Better Forms, Faster
                </h1>
                <p className="text-sm text-neutral-950">
                  Create beautiful forms that people actually enjoy filling out.
                </p>
              </div>
              <div className="w-full pt-2 flex justify-end">
                <Button variant="info" size="lg" animation="none" className="w-full rounded-lg">
                  Start Creating
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-4">{children}</div>
      </div>
    </div>
  );
};

export default layout;
