"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function HackathonRegistrationForm({ eventId }) {
  const [formData, setFormData] = useState({
    eventId: eventId,
    teamName: "",
    topicName: "",
    topicDescription: "",
    teamLeader: {
      name: "",
      email: "",
      mobileNumber: "",
      department: "",
      year: "",
      githubLink: "",
    },
    numberOfMembers: 2,
    teamMembers: Array(4).fill({
      name: "",
      department: "",
      year: "",
      githubLink: "",
    }),
  });
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTeamLeaderChange = (field, value) => {
    setFormData({
      ...formData,
      teamLeader: {
        ...formData.teamLeader,
        [field]: value,
      },
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      teamMembers: updatedMembers,
    });
  };

  const handleNumberOfMembersChange = (e) => {
    const count = parseInt(e.target.value);
    setFormData({
      ...formData,
      numberOfMembers: count,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      eventId: formData.eventId,
      teamName: formData.teamName,
      topicName: formData.topicName,
      topicDescription: formData.topicDescription,
      teamLeader: formData.teamLeader,
      numberOfMembers: formData.numberOfMembers.toString(),
      teamMembers: formData.teamMembers.slice(0, formData.numberOfMembers - 1), // -1 because team leader is not included here
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registration/team`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Team registration successful!");
        setFormData({
          eventId: "",
          teamName: "",
          topicName: "",
          topicDescription: "",
          teamLeader: {
            name: "",
            email: "",
            mobileNumber: "",
            department: "",
            year: "",
          },
          numberOfMembers: 2,
          teamMembers: Array(4).fill({
            name: "",
            department: "",
            year: "",
          }),
        });
        router.push("/");
      } else {
        const errorData = await response.json();
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      className="w-full max-w-lg md:max-w-2xl mx-auto rounded-md md:rounded-2xl p-3 md:p-8 shadow-input bg-black/20 border border-zinc-700 overflow-hidden"
      style={{ "--blue-500": "rgba(59, 130, 246, 0.6)" }}
    >
      <h2 className="font-bold text-xl md:text-2xl text-neutral-200">
        Hackathon Registration
      </h2>
      <p className="text-neutral-300 text-xs md:text-sm max-w-sm mt-1 md:mt-2 mb-3 md:mb-6">
        Fill out the form below to register your team for the hackathon
      </p>

      <form className="my-4 md:my-8" onSubmit={handleSubmit}>
        <div className="space-y-3 md:space-y-6">
          {/* Reduce all padding */}
          <div className="p-2 sm:p-3 md:p-4 rounded-xl bg-neutral-900/60">
            <h3 className="font-medium text-base md:text-lg mb-2 md:mb-4 text-neutral-200">
              Team Details
            </h3>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="teamName">Team Name*</Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="teamName"
                name="teamName"
                placeholder="Enter your team name"
                type="text"
                value={formData.teamName}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="topicName">Project Topic/Name*</Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="topicName"
                name="topicName"
                placeholder="Enter your project topic"
                type="text"
                value={formData.topicName}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="topicDescription">Project Description*</Label>
              <Textarea
                id="topicDescription"
                name="topicDescription"
                placeholder="Describe your project idea"
                rows={4}
                value={formData.topicDescription}
                onChange={handleChange}
                required
                className="resize-none"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="numberOfMembers">
                Number of Team Members* (including leader)
              </Label>
              <select
                id="numberOfMembers"
                name="numberOfMembers"
                value={formData.numberOfMembers}
                onChange={handleNumberOfMembersChange}
                required
                className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              >
                <option value="2">2 Members</option>
                <option value="3">3 Members</option>
                <option value="4">4 Members</option>
                <option value="5">5 Members</option>
              </select>
            </LabelInputContainer>
          </div>

          <div className="bg-neutral-900 p-4 rounded-xl">
            <h3 className="font-medium text-lg mb-4 text-neutral-200">
              Team Leader Details
            </h3>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="teamLeaderName">Full Name*</Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="teamLeaderName"
                placeholder="Enter team leader's name"
                type="text"
                value={formData.teamLeader.name}
                onChange={(e) => handleTeamLeaderChange("name", e.target.value)}
                required
              />
            </LabelInputContainer>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <LabelInputContainer className="flex-1">
                <Label htmlFor="teamLeaderMobileNumber">Mobile Number*</Label>
                <Input
                  className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                  id="teamLeaderMobileNumber"
                  placeholder="Enter mobile number"
                  type="tel"
                  value={formData.teamLeader.mobileNumber}
                  onChange={(e) =>
                    handleTeamLeaderChange("mobileNumber", e.target.value)
                  }
                  required
                  maxLength={10}
                  numbersonly="true"
                />
              </LabelInputContainer>

              <LabelInputContainer className="flex-1">
                <Label htmlFor="teamLeaderEmail">Email Address*</Label>
                <Input
                  className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                  id="teamLeaderEmail"
                  placeholder="Enter email address"
                  type="email"
                  value={formData.teamLeader.email}
                  onChange={(e) =>
                    handleTeamLeaderChange("email", e.target.value)
                  }
                  required
                />
              </LabelInputContainer>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
              <LabelInputContainer className="flex-1">
                <Label htmlFor="teamLeaderDepartment">Department*</Label>
                <Input
                  className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                  id="teamLeaderDepartment"
                  placeholder="e.g. Computer Science"
                  type="text"
                  value={formData.teamLeader.department}
                  onChange={(e) =>
                    handleTeamLeaderChange("department", e.target.value)
                  }
                />
              </LabelInputContainer>

              <LabelInputContainer className="flex-1">
                <Label htmlFor="teamLeaderYear">Year*</Label>
                <Input
                  className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                  id="teamLeaderYear"
                  placeholder="e.g. 3rd"
                  type="text"
                  value={formData.teamLeader.year}
                  onChange={(e) =>
                    handleTeamLeaderChange("year", e.target.value)
                  }
                />
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="flex-1 pt-4">
              <Label htmlFor="teamLeaderYear">GitHub Link*</Label>
              <Input
                className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                id="githubLink"
                placeholder="e.g. https://github.com/username"
                type="text"
                value={formData.teamLeader.githubLink}
                onChange={(e) =>
                  handleTeamLeaderChange("githubLink", e.target.value)
                }
              />
            </LabelInputContainer>
          </div>

          {/* Team Members */}
          {Array.from({ length: formData.numberOfMembers - 1 }).map(
            (_, index) => (
              <div key={index} className="bg-neutral-900 p-4 rounded-xl">
                <h3 className="font-medium text-lg mb-4 text-white">
                  Team Member {index + 1} Details
                </h3>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor={`memberName${index}`}>Full Name*</Label>
                  <Input
                    className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                    id={`memberName${index}`}
                    placeholder="Enter member's name"
                    type="text"
                    value={formData.teamMembers[index]?.name || ""}
                    onChange={(e) =>
                      handleMemberChange(index, "name", e.target.value)
                    }
                    required
                  />
                </LabelInputContainer>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <LabelInputContainer className="flex-1">
                    <Label htmlFor={`memberDepartment${index}`}>
                      Department*
                    </Label>
                    <Input
                      className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                      id={`memberDepartment${index}`}
                      placeholder="e.g. Computer Science"
                      type="text"
                      value={formData.teamMembers[index]?.department || ""}
                      onChange={(e) =>
                        handleMemberChange(index, "department", e.target.value)
                      }
                    />
                  </LabelInputContainer>

                  <LabelInputContainer className="flex-1">
                    <Label htmlFor={`memberYear${index}`}>Year*</Label>
                    <Input
                      className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                      id={`memberYear${index}`}
                      placeholder="e.g. 3rd"
                      type="text"
                      value={formData.teamMembers[index]?.year || ""}
                      onChange={(e) =>
                        handleMemberChange(index, "year", e.target.value)
                      }
                    />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="flex-1 pt-4">
                  <Label htmlFor={`memberYear${index}`}>GitHub Link*</Label>
                  <Input
                    className="h-9 md:h-10 text-xs md:text-sm px-2 md:px-3"
                    id={`githubLink${index}`}
                    placeholder="e.g. https://github.com/username"
                    type="text"
                    value={formData.teamMembers[index]?.githubLink || ""}
                    onChange={(e) =>
                      handleMemberChange(index, "githubLink", e.target.value)
                    }
                  />
                </LabelInputContainer>
              </div>
            ),
          )}

          <button
            className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 md:h-12 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Register Your Team
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

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        `flex h-10 w-full border-none bg-zinc-800 text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent
      file:text-sm file:font-medium placeholder-text-neutral-600
      focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-600
       disabled:cursor-not-allowed disabled:opacity-50
       shadow-[0px_0px_1px_1px_var(--neutral-700)]
       group-hover/input:shadow-none transition duration-400 min-h-[120px]`,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
