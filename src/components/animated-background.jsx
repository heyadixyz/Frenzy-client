"use client";
import { useEffect, useRef } from "react";

export const AnimatedBackground = ({
  primaryColor = "rgba(67, 19, 87, 0.35)",
  secondaryColor = "rgba(49, 47, 147, 0.35)",
  className = "",
  children,
}) => {
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

      // Top-left gradient (using secondaryColor)
      const gradientTL = ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        canvas.width * 0.7,
      );
      gradientTL.addColorStop(0, secondaryColor);
      gradientTL.addColorStop(0.6, secondaryColor.replace("0.35", "0.15"));
      gradientTL.addColorStop(1, secondaryColor.replace("0.35", "0"));
      ctx.fillStyle = gradientTL;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bottom-right gradient (using primaryColor)
      const gradientBR = ctx.createRadialGradient(
        canvas.width,
        canvas.height,
        0,
        canvas.width,
        canvas.height,
        canvas.width * 0.7,
      );
      gradientBR.addColorStop(0, primaryColor);
      gradientBR.addColorStop(0.6, primaryColor.replace("0.35", "0.15"));
      gradientBR.addColorStop(1, primaryColor.replace("0.35", "0"));
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
  }, [primaryColor, secondaryColor]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};