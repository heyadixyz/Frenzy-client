"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EventRegistrationForm({ eventId }) {
  const [formData, setFormData] = useState({
    eventId: eventId,
    name: "",
    email: "",
    mobileNumber: "",
    department: "",
    year: "",
    college: "",
    githubLink: "",
  });

  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registration/solo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Registration successful!");
        setFormData({
          eventId: "",
          name: "",
          email: "",
          mobileNumber: "",
          department: "",
          year: "",
          college: "",
        });
        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Could not register, please try again later!");
    }
  };

  return (
    <div
      className="w-full max-w-lg md:max-w-2xl min-w-sm md:min-w-lg mx-auto md:rounded-2xl rounded-md p-3 md:p-8 shadow-input bg-black/20 border border-zinc-700 overflow-hidden"
      style={{ "--blue-500": "rgba(59, 130, 246, 0.6)" }}
    >
      <h2 className="font-bold text-xl md:text-2xl text-neutral-200">
        Event Registration
      </h2>
      <p className="text-neutral-300 text-xs md:text-sm max-w-sm mt-1 md:mt-2 mb-3 md:mb-6">
        Fill out the form below to register for the event
      </p>

      {/* Rest of the form with reduced padding */}
      <form className="my-4 md:my-8" onSubmit={handleSubmit}>
        <div className="space-y-4 md:space-y-6">
          <div className="p-2 sm:p-4 md:p-6 rounded-xl bg-neutral-900/60">
            {/* Reduce spacing between fields */}
            <h3 className="font-medium text-base md:text-lg mb-3 md:mb-6 text-neutral-200">
              Personal Details
            </h3>

            <LabelInputContainer className="mb-5">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-neutral-300"
              >
                Full Name*
              </Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="name"
                name="name"
                placeholder="Enter your full name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-neutral-300"
              >
                Email Address*
              </Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="email"
                name="email"
                placeholder="Enter your email address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-5">
              <Label
                htmlFor="mobileNumber"
                className="text-sm font-medium text-neutral-300"
              >
                Mobile Number*
              </Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Enter your mobile number"
                type="tel"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-5">
              <Label
                htmlFor="department"
                className="text-sm font-medium text-neutral-300"
              >
                Department*
              </Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="department"
                name="department"
                placeholder="Enter your department name"
                type="text"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-5">
              <Label
                htmlFor="college"
                className="text-sm font-medium text-neutral-300"
              >
                College/University Name*
              </Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="college"
                name="college"
                placeholder="Enter your college name"
                type="text"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-5">
              <Label
                htmlFor="year"
                className="text-sm font-medium text-neutral-300"
              >
                Year*
              </Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="year"
                name="year"
                placeholder="e.g. 2nd"
                type="text"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-5">
              <Label
                htmlFor="gitubLink"
                className="text-sm font-medium text-neutral-300"
              >
                GitHub Link*
              </Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="year"
                name="year"
                placeholder="e.g. https://ghithub.com/username"
                type="text"
                value={formData.githubLink}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>
          </div>

          <button
            className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 md:h-12 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Register Now
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
