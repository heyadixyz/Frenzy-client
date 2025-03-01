import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export function BackgroundLines1({ heading, subheading, children }) {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-black">
      <h2 className="bg-clip-text text-white text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-8xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        {heading}
      </h2>
      <p className="max-w-xl mx-auto text-lg md:text-3xl text-neutral-200 dark:text-neutral-400 text-center">
        {subheading}
      </p>

      {/* Render children (event countdown) if provided */}
      {children}
    </BackgroundLines>
  );
}
