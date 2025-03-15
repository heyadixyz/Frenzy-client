"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const router = useRouter();

  useEffect(() => {
    const otpToken = localStorage.getItem("otpToken");
    if (!otpToken) {
      toast.error("Login session expired. Please login again.");
      router.push("/admin-auth/login");
      return;
    }

    // Setup countdown timer
    const timer = setInterval(() => {
      setCountdown((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast.error("OTP verification timeout. Please login again.");
          localStorage.removeItem("otpToken");
          router.push("/admin-auth/login");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    const otpToken = localStorage.getItem("otpToken");
    if (!otpToken) {
      toast.error("Login session expired. Please login again.");
      router.push("/admin-auth/login");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${otpToken}`,
          },
          body: JSON.stringify({ otp }),
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        localStorage.removeItem("otpToken");

        localStorage.setItem("adminToken", data.token);

        toast.success(data.message);

        // Redirect to dashboard
        router.push("/admin/manage");
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatedBackground
      primaryColor="rgba(67, 19, 87, 0.35)"
      secondaryColor="rgba(49, 47, 147, 0.35)"
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full max-w-md bg-black/50 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-purple-500/20 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Tech Frenzy Logo"
              width={150}
              height={50}
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-white">OTP Verification</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Enter the OTP sent to your email
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-white">
              OTP Code
            </Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
              }
              className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 text-center text-xl tracking-wide"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 font-medium cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
          <div className="text-center">
            <p className="text-white">
              Time remaining: {formatTime(countdown)}
            </p>
          </div>
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-purple-400 hover:text-purple-300 cursor-pointer"
              onClick={() => router.push("/admin-auth/login")}
            >
              Back to Login
            </Button>
          </div>
        </form>
      </div>
    </AnimatedBackground>
  );
}
