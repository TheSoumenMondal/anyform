import React from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const FormImage = () => {
  return (
    <div className=" flex w-full items-center justify-center px-6 md:px-0 border-y py-30">
      <div className="relative">
        <div className="relative overflow-hidden rounded-xl border border-dashed bg-accent p-2">
          <Image
            alt="illustration"
            src="/images/landing/illustration.jpg"
            width={400}
            height={300}
            className="h-full w-full rounded-lg object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-black/10 via-black/30 to-black/50"
          />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
          <div className="bg-accent flex gap-2 flex-col w-full rounded-lg overflow-hidden">
            <p className="text-xl tracking-wider font-instrumental-serif px-4 pt-2">
              Fill out the form below
            </p>
            <div className="flex flex-col gap-3 rounded-t-xl bg-card p-4 border-r">
              <Input type="text" placeholder="Enter Name" />

              <Input type="email" placeholder="Enter your email..." />

              <Button className="w-full" size="lg" variant="info" animation="none">
                Submit Form
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormImage;
