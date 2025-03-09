import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export function BackgroundLines1({ heading, subheading, children }) {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto w-full py-8 md:py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
          <h2 className="bg-clip-text text-white text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-4xl lg:text-7xl font-sans relative z-20 font-bold tracking-tight leading-tight">
            {heading}
          </h2>

          <p className="max-w-xl mx-auto text-sm md:text-lg lg:text-xl text-neutral-200 dark:text-neutral-400 text-center px-4">
            {subheading}
          </p>

          <div className="w-full flex flex-col items-center justify-center md:mt-2">
            {children}
          </div>
        </div>
      </div>
    </BackgroundLines>
  );
}
