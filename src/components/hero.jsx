"use client";
import React, { useState, useEffect } from "react";
import { Sparkles1 } from "./sparkels1";
import { BackgroundLines1 } from "./sparkels2";
import { EventCountdown } from "./event-timer";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Hero = () => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/current-event`,
        );
        const data = await res.json();

        if (data.status === "success") {
          // We have an event
          setEventData({
            hasEvent: true,
            eventTime: data.data.timerDates.startingDate,
            endingTime: data.data.timerDates.endingDate,
            eventTitle: data.data.title,
            eventTagline: data.data.description,
            isOpen: data.data.isOpen,
            type: data.data.type,
          });
          setIsOpen(data.data.isOpen);
          setType(data.data.type);
        } else {
          // No event
          setEventData({ hasEvent: false });
        }
      } catch (error) {
        toast.error("Something went wrong while fetching event data!");
        setEventData({ hasEvent: false });
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 md:w-16 md:h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (eventData?.hasEvent) {
    const formattedDescription = eventData.eventTagline
      ? eventData.eventTagline.split("\n").slice(0, 2).join("\n")
      : "";

    return (
      <div className="relative w-full">
        <BackgroundLines1
          heading={eventData.eventTitle}
          subheading={formattedDescription}
        >
          <EventCountdown
            eventTime={eventData.eventTime}
            endingTime={eventData.endingTime}
            isOpen={eventData.isOpen}
            type={eventData.type}
          />
        </BackgroundLines1>
      </div>
    );
  } else {
    // No event - regular TechFrenzy with sparkles component
    return (
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <Sparkles1 heading="TechFrenzy" subheading="The best club ever" />
        </motion.div>
      </div>
    );
  }
};
