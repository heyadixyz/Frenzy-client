"use client";

import AnimatedBackground from "@/components/animated-background";
import EventRegistrationForm from "@/components/event-registration-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EventRegistrationContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  return <EventRegistrationForm eventId={eventId} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full min-h-screen">
        <AnimatedBackground
          primaryColor="rgba(67, 19, 87, 0.35)"
          secondaryColor="rgba(49, 47, 147, 0.35)"
          className="min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-8"
        >
          <div className="w-full max-w-full overflow-x-hidden">
            <EventRegistrationContent />
          </div>
        </AnimatedBackground>
      </div>
    </Suspense>
  );
}