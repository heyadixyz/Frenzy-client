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

  const canvasRef = useRef(null);
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
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.speed = Math.random() * 0.5 + 0.1;
        this.direction = Math.random() * 360;
        this.color = `rgba(${Math.random() * 100 + 120}, ${
          Math.random() * 50 + 20
        }, ${Math.random() * 200 + 55}, ${this.opacity})`;
      }

      update() {
        const radian = (this.direction * Math.PI) / 180;
        this.x += this.speed * Math.cos(radian);
        this.y += this.speed * Math.sin(radian);

        this.direction += Math.random() * 4 - 2;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const particles = [];
    const particleCount = Math.min(100, Math.floor(window.innerWidth * 0.04));

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      const maxDistance = canvas.width * 0.07;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(130, 60, 200, ${opacity * 0.18})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#040404";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const gradientTL = ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        canvas.width * 0.7,
      );
      gradientTL.addColorStop(0, "rgba(49, 47, 147, 0.35)");
      gradientTL.addColorStop(0.6, "rgba(49, 47, 147, 0.15)");
      gradientTL.addColorStop(1, "rgba(49, 47, 147, 0)");
      ctx.fillStyle = gradientTL;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradientBR = ctx.createRadialGradient(
        canvas.width,
        canvas.height,
        0,
        canvas.width,
        canvas.height,
        canvas.width * 0.7,
      );
      gradientBR.addColorStop(0, "rgba(67, 19, 87, 0.35)");
      gradientBR.addColorStop(0.6, "rgba(67, 19, 87, 0.15)");
      gradientBR.addColorStop(1, "rgba(67, 19, 87, 0)");
      ctx.fillStyle = gradientBR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connectParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="py-16 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      />
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
