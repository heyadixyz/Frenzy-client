"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "team",
    timerDates: {
      startingDate: "",
      endingDate: "",
    },
    registrationDates: {
      startingDate: "",
      endingDate: "",
    },
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("You must be logged in to access this page");
      router.push("/admin-login");
      return;
    }

    fetchEvents();
  }, [router]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://pssvd9k9-81.inc1.devtunnels.ms/api/admin/event/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        setEvents(data.data);
        if (data.data.length > 0 && !selectedEventId) {
          setSelectedEventId(data.data[0]._id);
        }
      } else {
        toast.error(data.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Something went wrong while fetching events");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplicants = applicants.filter(
    (app) => app.eventId === selectedEventId,
  );

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const endpoint = editingEvent
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/update/${editingEvent._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/new`;

      const method = editingEvent ? "PATCH" : "POST";

      const eventData = {
        ...newEvent,
        timerDates: {
          startingDate: new Date(
            newEvent.timerDates.startingDate,
          ).toISOString(),
          endingDate: new Date(newEvent.timerDates.endingDate).toISOString(),
        },
      };

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (data.status === "success") {
        const eventId = editingEvent ? editingEvent._id : data.data._id;

        const regResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/setting`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventId: eventId,
              startingDate: new Date(
                newEvent.registrationDates.startingDate,
              ).toISOString(),
              endingDate: new Date(
                newEvent.registrationDates.endingDate,
              ).toISOString(),
            }),
          },
        );

        const regData = await regResponse.json();

        if (regData.status === "success") {
          toast.success(
            editingEvent
              ? "Event updated successfully"
              : "Event created successfully",
          );
          setNewEvent({
            title: "",
            description: "",
            type: "team",
            timerDates: {
              startingDate: "",
              endingDate: "",
            },
            registrationDates: {
              startingDate: "",
              endingDate: "",
            },
          });
          setEditingEvent(null);

          fetchEvents();
        } else {
          toast.error(
            "Event created but failed to set registration dates: " +
              regData.message,
          );
        }
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditEvent = (event) => {
    setEditingEvent(event);

    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);

      const localISOTime = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .substring(0, 16);

      return localISOTime;
    };

    setNewEvent({
      title: event.title,
      description: event.description,
      type: event.type || "team",
      timerDates: {
        startingDate: formatDateForInput(event.timerDates.startingDate),
        endingDate: formatDateForInput(event.timerDates.endingDate),
      },
      registrationDates: {
        startingDate: event.registrationDates
          ? formatDateForInput(event.registrationDates.startingDate)
          : "",
        endingDate: event.registrationDates
          ? formatDateForInput(event.registrationDates.endingDate)
          : "",
      },
    });
    setActiveTab("events");
  };

  const handleSendEmail = (applicantId) => {
    setIsLoading(true);

    setTimeout(() => {
      setApplicants(
        applicants.map((app) =>
          app.id === applicantId ? { ...app, emailSent: true } : app,
        ),
      );
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="container w-full mx-auto p-6 text-neutral-200 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 inline-block text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <p className="text-neutral-400">
            Manage events, applicants and settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-neutral-400 text-sm">Admin</span>
        </div>
      </div>

      <Tabs
        defaultValue="events"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8 bg-neutral-900">
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-blue-600"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="m9 16 2 2 4-4" />
              </svg>
              Event Management
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="applicants"
            className="data-[state=active]:bg-blue-600"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Applicants
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="timer"
            className="data-[state=active]:bg-blue-600"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Event Settings
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                <h3 className="font-medium text-xl mb-4">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h3>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <LabelInputContainer>
                    <Label htmlFor="eventTitle">Event Title*</Label>
                    <Input
                      id="eventTitle"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      required
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="eventDescription">Description*</Label>
                    <Textarea
                      id="eventDescription"
                      placeholder="Event description"
                      rows={4}
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="eventType">Event Type*</Label>
                    <select
                      id="eventType"
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          type: e.target.value,
                        })
                      }
                      className="bg-zinc-800 text-white rounded-md px-3 py-2 w-full"
                      required
                    >
                      <option value="team">Team</option>
                      <option value="solo">Solo</option>
                    </select>
                  </LabelInputContainer>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabelInputContainer>
                      <Label htmlFor="startDate">Start Date/Time*</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={newEvent.timerDates.startingDate}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            timerDates: {
                              ...newEvent.timerDates,
                              startingDate: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </LabelInputContainer>

                    <LabelInputContainer>
                      <Label htmlFor="endDate">End Date/Time*</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={newEvent.timerDates.endingDate}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            timerDates: {
                              ...newEvent.timerDates,
                              endingDate: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </LabelInputContainer>
                  </div>
                  <h4 className="font-bold text-base mt-4 mb-3">
                    Registration Period
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabelInputContainer>
                      <Label htmlFor="regStartDate">
                        Registration Start Date*
                      </Label>
                      <Input
                        id="regStartDate"
                        type="datetime-local"
                        value={newEvent.registrationDates.startingDate}
                        onChange={(e) => {
                          setNewEvent({
                            ...newEvent,
                            registrationDates: {
                              ...newEvent.registrationDates,
                              startingDate: e.target.value,
                            },
                          });
                        }}
                        required
                      />
                    </LabelInputContainer>

                    <LabelInputContainer>
                      <Label htmlFor="regEndDate">Registration End Date*</Label>
                      <Input
                        id="regEndDate"
                        type="datetime-local"
                        value={newEvent.registrationDates.endingDate}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            registrationDates: {
                              ...newEvent.registrationDates,
                              endingDate: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </LabelInputContainer>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </span>
                      ) : editingEvent ? (
                        "Update Event"
                      ) : (
                        "Create Event"
                      )}
                    </Button>
                    {editingEvent && (
                      <Button
                        type="button"
                        className="bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
                        onClick={() => {
                          setEditingEvent(null);
                          setNewEvent({
                            title: "",
                            description: "",
                            type: "team",
                            timerDates: {
                              startingDate: "",
                              endingDate: "",
                            },
                            registrationDates: {
                              startingDate: "",
                              endingDate: "",
                            },
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3">
              <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-xl">Events List</h3>
                  <Input
                    placeholder="Search events..."
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400">
                      No events found. Create your first event.
                    </div>
                  ) : (
                    events
                      .filter((event) =>
                        event.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      )
                      .map((event) => (
                        <div
                          key={event._id}
                          className="border border-neutral-800 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            {event.images && event.images.length > 0 ? (
                              <div className="md:w-1/4">
                                <div
                                  className="h-32 rounded-lg bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url(https://pssvd9k9-81.inc1.devtunnels.ms${event.images[0]})`,
                                  }}
                                ></div>
                              </div>
                            ) : null}
                            <div
                              className={
                                event.images && event.images.length > 0
                                  ? "md:w-3/4"
                                  : "w-full"
                              }
                            >
                              <div className="flex flex-col md:flex-row justify-between mb-2">
                                <h4 className="font-medium text-lg">
                                  {event.title}
                                </h4>
                                <div className="flex items-center gap-2 text-blue-500 text-sm">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                  </svg>
                                  <span className="capitalize">
                                    {event.type} event
                                  </span>
                                </div>
                              </div>
                              <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs py-1 px-2 bg-neutral-800 rounded-full text-neutral-300">
                                  {formatDate(event.timerDates.startingDate)}
                                </span>
                                <span className="text-xs py-1 px-2 bg-neutral-800 rounded-full text-neutral-300">
                                  to
                                </span>
                                <span className="text-xs py-1 px-2 bg-neutral-800 rounded-full text-neutral-300">
                                  {formatDate(event.timerDates.endingDate)}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-neutral-800 hover:bg-neutral-700"
                                  onClick={() => handleEditEvent(event)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Applicants Tab */}
        <TabsContent value="applicants" className="space-y-6">
          <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-medium text-xl mb-2">
                  Applicants & Registration
                </h3>
                <p className="text-neutral-400 text-sm">
                  Review and manage registrations for your events
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <select
                  className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Search applicants..."
                  className="md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-neutral-800 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-neutral-700 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <p className="text-neutral-400">
                  No registrations found for this event.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left py-3 px-4 font-medium text-neutral-300">
                        Team Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-300">
                        Team Leader
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-300">
                        Project Topic
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-300">
                        Members
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-300">
                        Registered
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-neutral-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplicants
                      .filter(
                        (app) =>
                          app.teamName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          app.teamLeaderName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          app.projectTopic
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                      )
                      .map((applicant) => (
                        <tr
                          key={applicant.id}
                          className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                        >
                          <td className="py-3 px-4">{applicant.teamName}</td>
                          <td className="py-3 px-4">
                            <div>{applicant.teamLeaderName}</div>
                            <div className="text-sm text-neutral-400">
                              {applicant.teamLeaderEmail}
                            </div>
                            <div className="text-sm text-neutral-400">
                              {applicant.teamLeaderMobile}
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <div
                              className="truncate"
                              title={applicant.projectTopic}
                            >
                              {applicant.projectTopic}
                            </div>
                          </td>
                          <td className="py-3 px-4">{applicant.members}</td>
                          <td className="py-3 px-4">
                            <div>{formatDate(applicant.submittedAt)}</div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                className="bg-neutral-800 hover:bg-neutral-700"
                                onClick={() => {
                                  // View full details logic here
                                  console.log("View details for", applicant.id);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                className={
                                  applicant.emailSent
                                    ? "bg-green-900/30 text-green-400 cursor-default"
                                    : "bg-blue-900/30 hover:bg-blue-900/50 text-blue-400"
                                }
                                disabled={applicant.emailSent || isLoading}
                                onClick={() => handleSendEmail(applicant.id)}
                              >
                                {applicant.emailSent
                                  ? "Email Sent"
                                  : "Send Email"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Event Settings Tab */}
        <TabsContent value="timer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
              <h3 className="font-medium text-xl mb-4">
                Event Timing Settings
              </h3>
              <p className="text-neutral-400 text-sm mb-6">
                Configure countdown timers for your events
              </p>

              <div className="space-y-4">
                <select
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>

                {events.find((e) => e.id === selectedEventId) && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <LabelInputContainer>
                        <Label>Registration Opens</Label>
                        <Input
                          type="datetime-local"
                          defaultValue={
                            events.find((e) => e.id === selectedEventId)
                              ?.startDate
                          }
                        />
                      </LabelInputContainer>

                      <LabelInputContainer>
                        <Label>Registration Closes</Label>
                        <Input
                          type="datetime-local"
                          defaultValue={
                            events.find((e) => e.id === selectedEventId)
                              ?.endDate
                          }
                        />
                      </LabelInputContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <LabelInputContainer>
                        <Label>Event Starts</Label>
                        <Input type="datetime-local" />
                      </LabelInputContainer>

                      <LabelInputContainer>
                        <Label>Event Ends</Label>
                        <Input type="datetime-local" />
                      </LabelInputContainer>
                    </div>

                    <div className="mt-6">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Update Timer Settings
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
              <h3 className="font-medium text-xl mb-4">Preview</h3>
              <p className="text-neutral-400 text-sm mb-6">
                Here's how your countdown timer will appear to users
              </p>

              {events.find((e) => e.id === selectedEventId) && (
                <div className="border border-neutral-800 rounded-lg p-6 bg-neutral-950">
                  <h4 className="font-medium text-lg mb-6 text-center">
                    {events.find((e) => e.id === selectedEventId)?.title}
                  </h4>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="bg-neutral-800 w-full py-3 rounded-md text-center text-2xl font-bold">
                        10
                      </div>
                      <div className="text-xs mt-1 text-neutral-400">Days</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-neutral-800 w-full py-3 rounded-md text-center text-2xl font-bold">
                        08
                      </div>
                      <div className="text-xs mt-1 text-neutral-400">Hours</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-neutral-800 w-full py-3 rounded-md text-center text-2xl font-bold">
                        45
                      </div>
                      <div className="text-xs mt-1 text-neutral-400">
                        Minutes
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-neutral-800 w-full py-3 rounded-md text-center text-2xl font-bold">
                        30
                      </div>
                      <div className="text-xs mt-1 text-neutral-400">
                        Seconds
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-neutral-400">
                    Registration{" "}
                    {new Date() <
                    new Date(
                      events.find((e) => e.id === selectedEventId)?.endDate,
                    )
                      ? "closes"
                      : "closed"}{" "}
                    on{" "}
                    {formatDate(
                      events.find((e) => e.id === selectedEventId)?.endDate,
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <LabelInputContainer>
                  <Label>Custom Message (Optional)</Label>
                  <Textarea
                    placeholder="Add a custom message to display with the countdown"
                    rows={3}
                  />
                </LabelInputContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog for Delete */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h4 className="text-lg font-medium mb-4">Confirm Deletion</h4>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete "{eventToDelete?.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                className="bg-neutral-800 hover:bg-neutral-700"
                onClick={cancelDeleteEvent}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteEvent}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
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
        `flex h-10 w-full border-none bg-zinc-800 text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent
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
