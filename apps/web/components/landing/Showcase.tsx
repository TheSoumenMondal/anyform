import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LayersLogoIcon,
  Settings01Icon,
  CircleArrowUpRightIcon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";

const features = [
  {
    title: "Customizable",
    desc: "Fully themeable fields, layouts and logic to match your brand.",
    icon: LayersLogoIcon,
  },
  {
    title: "Secure",
    desc: "Built-in encryption and enterprise-grade access controls.",
    icon: LockIcon,
  },
  {
    title: "Integrations",
    desc: "Connect seamlessly to your favorite tools with one click.",
    icon: Settings01Icon,
  },
  {
    title: "Share & Embed",
    desc: "Publish forms instantly and embed them anywhere you need.",
    icon: CircleArrowUpRightIcon,
  },
];

const Showcase = () => {
  return (
    <section className="w-full pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-instrumental-serif font-bold text-foreground">
            Everything you need
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-125 leading-relaxed">
            Powerful features built to help you create, manage, and share forms without any
            friction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((f) => (
            <div
              key={f.title}
              className="group border border-dashed bg-secondary/20 backdrop-blur-xl p-6 flex flex-col gap-4  relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0  transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col gap-4">
                <Button className="size-10" variant="decorations">
                  <HugeiconsIcon icon={f.icon} className="size-6 text-primary" />
                </Button>
                <div>
                  <h3 className="text-xl tracking-wide font-bold mb-2 font-instrumental-serif">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-cormorant-garamond leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-6">
          <p>© {new Date().getFullYear()} AnyForm Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed with ❤️ for better forms.</p>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
