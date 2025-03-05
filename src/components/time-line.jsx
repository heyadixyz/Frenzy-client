"use client";

import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

export const Timeline = () => {
  const data = [
    {
      id: 1,
      date: "April 17th",
      title: "Registration Opens",
      description:
        "Register for the hackathon and get ready to embark on an exciting journey of innovation.",
    },
    {
      id: 2,
      date: "May 7th",
      title: "Registration Closes",
      description:
        "Last day to register for the hackathon. Don't miss out on the opportunity to showcase your skills and win exciting prizes.",
    },
    {
      id: 3,
      date: "Day 1: 10:00 AM - 10:30 AM, May 17th",
      title: "Energize Your Brain",
      description:
        "Start your day with an inspirational keynote or a quick icebreaker session to getyour creative juices flowing. Meet your fellow hackers and form connections that will last beyond the event.",
    },
    {
      id: 4,
      date: "11:00 AM - 1:15 PM",
      title: "Hackathon Kickoff",
      description:
        "The hacking officially begins! Dive into your projects, collaborate with your team, and start building your masterpiece. Remember, this is where your journey toinnovation takes off.",
    },
    {
      id: 5,
      date: "1:20 PM - 2:20 PM",
      title: "Recharge and Refuel",
      description: `It's lunchtime! Enjoy a delicious meal and take a well-deserved break. Use this
        time to socialize, share ideas, and recharge for the exciting journey ahead.`,
    },
    {
      id: 6,
      date: "2:30 PM - 4:45 PM",
      title: "Uninterrupted Hacking",
      description: `Back to your projects! Focus on coding, designing, and refining your ideas. Our
        mentors will be available online to assist you, so don't hesitate to reach out if you
        need guidance.`,
    },
    {
      id: 7,
      date: "5:00 PM - 7:00 PM",
      title: "Journey Back Home",
      description: `Time to head home. We understand the importance of work-life balance. Take
        this break to relax, grab dinner, and spend quality time with your loved ones.`,
    },
    {
      id: 8,
      date: "7:00 PM Onwards",
      title: "Hack from Home",
      description: `Continue your hackathon journey right from the comfort of your home. Whether
        you prefer your cozy couch or a dedicated home office, make yourself
        comfortable and keep those commits coming!`,
    },
    {
      id: 9,
      date: "Day 2: 10:00 AM - 11:00 AM, May 18th",
      title: "Rise and Shine",
      description: `Return to campus, ready to tackle the final stretch of your project. Today is all
        about putting the finishing touches on your masterpiece.`,
    },
    {
      id: 10,
      date: "11:00 AM",
      title: "Deadline Looms!",
      description: `Your project submission deadline is approaching rapidly! Ensure that you've
        covered all aspects, from code to documentation.`,
    },
    {
      id: 11,
      date: "11:00 AM - 11:30 PM",
      title: "Video And PPT Creation",
      description: `Prepare your PPT, rehearse your pitch, and make sure you're ready to be
        impressed by your awesome video.`,
    },
    {
      id: 12,
      date: "11:30 AM - 11:45 AM",
      title: "Final Checks",
      description: `Double-check your project ZIP file, video, and any other submission materials.
        Ensure everything is in order.`,
    },
    {
      id: 13,
      date: "12:00 PM",
      title: "Submissions Close",
      description: `Submit your project ZIP file, PPT & Video.`,
    },
    {
      id: 14,
      date: "12:00 PM - 4:00 PM",
      title: "Final Evaluation",
      description: `All projects will undergo thorough evaluation by the judges, based on their
        functionality, innovation, presentation, etc. according to the requirements.`,
    },
    {
      id: 15,
      date: "4:00 PM",
      title: "Winners Announced",
      description: `Stay tuned as we announce the winners and showcase the incredible projects
        that came to life during this hackathon.`,
    },
    {
      id: 16,
      date: "4:00 PM - 5:00 PM",
      title: "Post-Event Networking and Prize Distribution",
      description: `Connect with fellow hackers, mentors, and sponsors during this informal
        networking session. Share feedback and exchange contact information for future
        collaborations.`,
    },
  ];

  const canvasRef = useRef(null);

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

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.5,
      );

      gradient.addColorStop(0, "rgba(40, 10, 60, 0.15)");
      gradient.addColorStop(0.5, "rgba(20, 5, 30, 0.1)");
      gradient.addColorStop(1, "rgba(10, 5, 15, 0.05)");

      ctx.fillStyle = gradient;
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
      <div className="mb-16">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-b from-white to-purple-200/70 text-transparent bg-clip-text mb-4">
          Event Timeline
        </h2>
        <p className="text-center text-purple-100/70 max-w-xl mx-auto">
          Follow our schedule to make the most of this hackathon experience
        </p>
      </div>

      <div className="timeline-container">
        <VerticalTimeline lineColor="rgba(168, 85, 247, 0.15)">
          {data.map((item, index) => (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--work"
              contentStyle={{
                background: "rgba(139, 92, 246, 0.05)",
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
              date=<strong>{item.date}</strong>
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
