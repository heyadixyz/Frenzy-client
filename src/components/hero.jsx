"use client";
import React, { useState, useEffect } from "react";
import { Sparkles1 } from "./sparkels1";
import { BackgroundLines1 } from "./sparkels2";
import { EventCountdown } from "./event-timer";
import { motion } from "framer-motion";

export const Hero = () => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate API call to fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Scenario 1: Upcoming event
      setEventData({
        hasEvent: true,
        eventTime: new Date(Date.now() + 5 * 1000).toISOString(),
        // eventTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        eventTitle: "Hackathon 2025",
        eventTagline: "Build the future in 48 hours",
      });

      // Scenario 2: No upcoming event
      // setEventData({ hasEvent: false });

      setLoading(false);
    };

    fetchEventData();
  }, []);

  if (loading) {
    return (
      <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (eventData?.hasEvent) {
    // upcoming event with BackgroundLines component
    return (
      <div className="relative">
        <BackgroundLines1
          heading={eventData.eventTitle}
          subheading={eventData.eventTagline}
        >
          <EventCountdown eventTime={eventData.eventTime} />
        </BackgroundLines1>
      </div>
    );
  } else {
    // No event - regular TechFrenzy with sparkles component
    return (
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles1 heading="TechFrenzy" subheading={"The best club ever"} />
        </motion.div>
      </div>
    );
  }
};
