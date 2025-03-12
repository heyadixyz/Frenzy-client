"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { toast } from "sonner";

export const Timeline = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/past-events`,
        );
        const data = await res.json();

        if (data.status === "success") {
          setData(data.data);
        } else {
          setError("Failed to fetch past events");
        }
      } catch (err) {
        toast.error("Error fetching events");
        setError("Error loading past events");
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  return (
    <div className="py-16 relative overflow-hidden">
      <div className="mb-16 p-6 md:p-0">
        <h2 className="md:text-4xl text-3xl font-extrabold text-center bg-gradient-to-b from-white to-purple-200/70 text-transparent bg-clip-text mb-4">
          Past Events
        </h2>
        <p className="text-center text-purple-100/70 max-w-xl mx-auto text-sm md:text-base">
          Follow our schedule to make the most of <br />
          this hackathon experiences
        </p>
      </div>

      <div className="timeline-container pl-6 pr-2 md:pl-0 md:pr-0">
        <VerticalTimeline lineColor="rgba(168, 85, 247, 0.15)">
          {data.map((item, index) => (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--work"
              contentStyle={{
                background: "rgba(20, 10, 30, 0.4)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(168, 85, 247, 0.08)",
                borderRadius: "16px",
                color: "#fff",
                padding: "28px",
              }}
              contentArrowStyle={{
                borderRight: "10px solid rgba(168, 85, 247, 0.08)",
              }}
              date=<strong>
                {new Date(item.timerDates.startingDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                )}{" "}
                -{" "}
                {new Date(item.timerDates.endingDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              </strong>
              dateClassName=""
              iconStyle={{
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)",
                color: "#fff",
                boxShadow: "0 0 0 4px rgba(168, 85, 247, 0.15)",
                width: "36px",
                height: "36px",
                marginLeft: "-18px",
                marginTop: "14px",
                backdropFilter: "blur(10px)",
              }}
              icon={<Check size={16} className="m-auto" />}
            >
              <h3 className="font-semibold text-xl bg-gradient-to-r from-white to-purple-100/90 text-transparent bg-clip-text mb-2">
                {item.title}
              </h3>
              {item.subtitle && (
                <h4 className="text-purple-100/70 mb-2">{item.subtitle}</h4>
              )}
              <p className="text-white/60 font-light leading-relaxed text-sm">
                {item.description}
              </p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>

      <div className="flex justify-center mt-12">
        <div className="bg-gradient-to-r from-purple-400/10 via-purple-500/20 to-purple-300/10 h-px w-40 rounded-full" />
      </div>

      <style jsx global>{`
        .timeline-date {
          font-family: "Inter", sans-serif;
          color: rgba(233, 213, 255, 0.8) !important;
          font-weight: 400;
          font-size: 0.85rem;
          letter-spacing: 0.2px;
          padding: 4px 10px;
          background: rgba(168, 85, 247, 0.08);
          border-radius: 6px;
          backdrop-filter: blur(8px);
        }

        .vertical-timeline-element-content {
          transition: all 0.35s ease !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
        }

        .vertical-timeline-element-content:hover {
          transform: translateY(-3px);
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.08) 0%,
            rgba(168, 85, 247, 0.05) 100%
          ) !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid rgba(168, 85, 247, 0.15) !important;
        }

        .vertical-timeline::before {
          width: 2px;
          background: linear-gradient(
            to bottom,
            rgba(139, 92, 246, 0.05),
            rgba(168, 85, 247, 0.15),
            rgba(139, 92, 246, 0.05)
          );
        }

        .vertical-timeline-element-icon {
          box-shadow:
            0 0 0 4px rgba(168, 85, 247, 0.1),
            0 0 0 8px rgba(168, 85, 247, 0.05) !important;
          transition: all 0.3s ease;
        }

        .vertical-timeline-element:hover .vertical-timeline-element-icon {
          background: linear-gradient(
            135deg,
            rgba(168, 85, 247, 0.25) 0%,
            rgba(139, 92, 246, 0.15) 100%
          ) !important;
          box-shadow:
            0 0 0 4px rgba(168, 85, 247, 0.2),
            0 0 0 8px rgba(168, 85, 247, 0.08) !important;
        }

        .vertical-timeline-element-icon .lucide-check {
          color: rgba(233, 213, 255, 0.9);
        }

        @media only screen and (min-width: 1170px) {
          .vertical-timeline-element-content .vertical-timeline-element-date {
            padding: 0.8em 1em !important;
          }
        }
      `}</style>
    </div>
  );
};
