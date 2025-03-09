"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export const EventCountdown = ({ eventTime, endingTime, type, isOpen }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isInitialRender = useRef(true);

  const confettiContainerRef = useRef(null);

  const { width, height } = useWindowSize();

  useEffect(() => {
    setIsClient(true);
  }, []);

  function calculateTimeLeft() {
    const difference = new Date(eventTime) - new Date();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: true,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isComplete: false,
    };
  }

  useEffect(() => {
    if (!isClient) return;

    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    if (initialTimeLeft.isComplete && isInitialRender.current) {
      setIsFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000);
    }

    isInitialRender.current = false;
  }, [eventTime, isClient]);

  useEffect(() => {
    if (!isClient || isFinished) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isComplete && !isFinished) {
        setIsFinished(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 10000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventTime, isFinished, isClient]);

  if (!isClient || timeLeft === null) {
    return (
      <div
        className="my-10 flex flex-col items-center"
        style={{ minHeight: "240px" }}
      ></div>
    );
  }

  return (
    <motion.div
      className="my-10 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: "240px" }}
    >
      {isClient && showConfetti && (
        <div
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <Confetti
            width={width}
            height={height}
            numberOfPieces={500}
            recycle={false}
            gravity={0.2}
            colors={[
              "#FF577F",
              "#FF884B",
              "#FFFE7A",
              "#A2FF86",
              "#6499E9",
              "#9376E0",
            ]}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div
            key="live"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 py-3 px-8 bg-green-600/20 rounded-full border border-green-500"
          >
            <span className="text-xl md:text-2xl font-bold text-green-400">
              Event is Live Now!
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="countdown"
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <TimeBlock value={timeLeft.days} label="Days" />
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <TimeBlock value={timeLeft.minutes} label="Minutes" />
            <TimeBlock value={timeLeft.seconds} label="Seconds" />
          </motion.div>
        )}
        <span className="text-white text-sm md:text-lg">
          <p>
            {new Date(eventTime).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {endingTime &&
              new Date(endingTime).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
          </p>
        </span>
      </AnimatePresence>

      {isFinished ? (
        <div></div>
      ) : isOpen ? (
        type === "team" || type === "hackathon" ? (
          <motion.a
            href="/hackathon-registration"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="px-8 py-3 relative z-10 cursor-pointer rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Register Team
          </motion.a>
        ) : (
          <motion.a
            href="/event-registration"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="px-8 py-3 relative z-10 cursor-pointer rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Register Now
          </motion.a>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="px-8 py-3 relative z-10 rounded-full bg-gray-700 text-gray-400 font-bold text-lg shadow-lg cursor-not-allowed"
        >
          Registration Closed
        </motion.div>
      )}
    </motion.div>
  );
};

const TimeBlock = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-black/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-3 w-20 h-20 flex items-center justify-center shadow-lg shadow-indigo-500/20">
      <span className="text-3xl font-mono text-white">{value}</span>
    </div>
    <span className="text-indigo-200 mt-2">{label}</span>
  </div>
);
