"use client";

import { AnimatedBackground } from "@/components/animated-background";
import HackathonRegistrationForm from "@/components/hackathon-registration-form";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  return (
    <div>
      <AnimatedBackground
        primaryColor="rgba(67, 19, 87, 0.35)"
        secondaryColor="rgba(49, 47, 147, 0.35)"
        className="min-h-screen flex items-center justify-center p-4 md:p-8"
      >
        <HackathonRegistrationForm eventId={eventId} />
      </AnimatedBackground>
    </div>
  );
}
