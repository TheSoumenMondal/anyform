"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export const Timeline = ({ data, scrollContainerRef }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef as React.RefObject<HTMLElement> | undefined,
    offset: ["start 10%", "end 80%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div className="w-full bg-transparent font-sans" ref={containerRef}>
      {/* Header */}
      <div className="px-6 py-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold mb-1">
          Progress
        </p>
        <h2 className="text-base font-semibold text-foreground">Form Structure</h2>
        <p className="text-muted-foreground text-xs mt-1">
          {data.length} {data.length === 1 ? "question" : "questions"} total
        </p>
      </div>

      {/* Timeline items */}
      <div ref={ref} className="relative px-6 pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex gap-4 pt-6">
            {/* Dot + line column */}
            <div className="relative flex flex-col items-center w-8 shrink-0">
              <div className="z-10 h-7 w-7 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-muted-foreground leading-none">
                  {index + 1}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/60 mb-0.5">
                {item.title}
              </p>
              <div className="text-sm">{item.content}</div>
            </div>
          </div>
        ))}

        {/* Background track line */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-[2.3rem] top-6 w-[2px] bg-gradient-to-b from-transparent via-border to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          {/* Animated fill line */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-violet-500 via-blue-500 to-cyan-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
