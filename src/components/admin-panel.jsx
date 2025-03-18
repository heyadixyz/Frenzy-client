"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Mail,
  Trash2,
  X,
  Check,
  FileEdit,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [teamApplicants, setTeamApplicants] = useState([]);
  const [soloApplicants, setSoloApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState({ subject: "", html: "" });
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [sendingBulkEmail, setSendingBulkEmail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState(null);
  const [deletingApplicant, setDeletingApplicant] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedApplicantDetails, setSelectedApplicantDetails] =
    useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newsletterEmails, setNewsletterEmails] = useState([]);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [emailToRemove, setEmailToRemove] = useState(null);
  const [removeEmailDialogOpen, setRemoveEmailDialogOpen] = useState(false);
  const [removingEmail, setRemovingEmail] = useState(false);
  const [newsletterTemplate, setNewsletterTemplate] = useState({
    subject: "",
    html: "",
  });
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newsletterPage, setNewsletterPage] = useState(1);
  const [newsletterTotalPages, setNewsletterTotalPages] = useState(1);

  const handleImageUpload = async (eventId) => {
    if (eventImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (eventImages.length > 20) {
      toast.error("Maximum 20 images are allowed");
      return;
    }

    setUploadingImages(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      eventImages.forEach((file) => {
        formData.append("image", file);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/image/${eventId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Images uploaded successfully");
        setEventImages([]);
        // Refresh events list to see the updated images
        fetchEvents();
      } else {
        toast.error(data.message || "Failed to upload images");
      }
    } catch (error) {
      toast.error("Something went wrong while uploading images");
    } finally {
      setUploadingImages(false);
    }
  };

  const FileInput = ({ onChange, multiple = false }) => {
    const inputRef = React.useRef(null);

    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-neutral-800 hover:bg-neutral-700 flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Choose Files
        </Button>
        <input
          type="file"
          ref={inputRef}
          onChange={onChange}
          multiple={multiple}
          accept="image/*"
          className="hidden"
        />
        {eventImages.length > 0 && (
          <span className="text-sm text-neutral-400">
            {eventImages.length} file(s) selected
          </span>
        )}
      </div>
    );
  };

  const fetchApplicants = async (eventId) => {
    if (!eventId) return;

    setLoadingApplicants(true);
    setSelectedApplicants([]);

    try {
      const token = localStorage.getItem("adminToken");

      // Fetch team applicants
      const teamResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/participants/team/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const teamData = await teamResponse.json();

      // Fetch solo applicants
      const soloResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/participants/solo/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const soloData = await soloResponse.json();

      if (teamData.status === "success") {
        setTeamApplicants(teamData.data || []);
      } else {
        toast.error("Failed to fetch team applicants");
      }

      if (soloData.status === "success") {
        setSoloApplicants(soloData.data || []);
      } else {
        toast.error("Failed to fetch solo applicants");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching applicants");
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Function to send email to a single applicant
  const handleSendEmail = async (applicantId, type) => {
    setSendingEmail(applicantId);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/participants/${type}/applicant/mail/${applicantId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Email sent successfully");
        // Update the applicant's status in the state
        if (type === "solo") {
          setSoloApplicants((prev) =>
            prev.map((app) =>
              app._id === applicantId ? { ...app, isMailSent: true } : app,
            ),
          );
        } else {
          setTeamApplicants((prev) =>
            prev.map((app) =>
              app._id === applicantId ? { ...app, isMailSent: true } : app,
            ),
          );
        }
      } else {
        toast.error(data.message || "Failed to send email");
      }
    } catch (error) {
      toast.error("Something went wrong while sending email");
    } finally {
      setSendingEmail(null);
    }
  };

  // Function to send emails to multiple applicants
  const handleSendBulkEmail = async () => {
    if (!emailTemplate.subject || !emailTemplate.html) {
      toast.error("Please provide both subject and HTML content");
      return;
    }

    setSendingBulkEmail(true);

    try {
      const token = localStorage.getItem("adminToken");

      // First set the email template
      const templateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/participants/applicant/mail/template`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: emailTemplate.subject,
            html: emailTemplate.html.replace(/\n/g, " "),
          }),
        },
      );

      const templateData = await templateResponse.json();

      if (templateData.status !== "success") {
        throw new Error(templateData.message || "Failed to set email template");
      }

      // Get solo and team applicants
      const soloApplicantIds = selectedApplicants.filter((id) =>
        soloApplicants.some((app) => app._id === id),
      );

      const teamApplicantIds = selectedApplicants.filter((id) =>
        teamApplicants.some((app) => app._id === id),
      );

      const emailPromises = [];

      // Send emails to solo applicants
      for (const id of soloApplicantIds) {
        const promise = fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/participants/solo/applicant/mail/${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        emailPromises.push(promise);
      }

      // Send emails to team applicants
      for (const id of teamApplicantIds) {
        const promise = fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/participants/team/applicant/mail/${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        emailPromises.push(promise);
      }

      // Wait for all emails to be sent
      await Promise.all(emailPromises);

      toast.success("Emails sent successfully");

      // Update applicant status in state
      setSoloApplicants((prev) =>
        prev.map((app) =>
          selectedApplicants.includes(app._id)
            ? { ...app, isMailSent: true }
            : app,
        ),
      );

      setTeamApplicants((prev) =>
        prev.map((app) =>
          selectedApplicants.includes(app._id)
            ? { ...app, isMailSent: true }
            : app,
        ),
      );

      // Reset and close dialog
      setSelectedApplicants([]);
      setEmailTemplate({ subject: "", html: "" });
      setEmailDialogOpen(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong while sending emails");
    } finally {
      setSendingBulkEmail(false);
    }
  };

  // Function to delete an applicant
  const handleDeleteApplicant = async () => {
    if (!applicantToDelete) return;

    setDeletingApplicant(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/participants/${applicantToDelete.type}/applicant/${applicantToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Applicant deleted successfully");

        // Remove the deleted applicant from the state
        if (applicantToDelete.type === "solo") {
          setSoloApplicants((prev) =>
            prev.filter((app) => app._id !== applicantToDelete.id),
          );
        } else {
          setTeamApplicants((prev) =>
            prev.filter((app) => app._id !== applicantToDelete.id),
          );
        }

        // Also remove from selected applicants if present
        setSelectedApplicants((prev) =>
          prev.filter((id) => id !== applicantToDelete.id),
        );
      } else {
        toast.error(data.message || "Failed to delete applicant");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting applicant");
    } finally {
      setDeletingApplicant(false);
      setDeleteDialogOpen(false);
      setApplicantToDelete(null);
    }
  };

  const handleEventSelection = (eventId) => {
    setSelectedEventId(eventId);
    fetchApplicants(eventId);
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/all`,
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
      toast.error("Something went wrong while fetching events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const fetchNewsletterEmails = async (page = 1) => {
    setNewsletterLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news-letter/all?page=${page}&limit=50`,
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
        setNewsletterEmails(data.data || []);
        setNewsletterTotalPages(Math.ceil(data.total / 50) || 1);
      } else {
        toast.error(data.message || "Failed to fetch newsletter subscribers");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching newsletter subscribers");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const handleRemoveEmail = async () => {
    if (!emailToRemove) return;

    setRemovingEmail(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news-letter/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailToRemove,
          }),
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Email removed successfully");
        setNewsletterEmails((prev) =>
          prev.filter((item) => item.email !== emailToRemove),
        );
      } else {
        toast.error(data.message || "Failed to remove email");
      }
    } catch (error) {
      toast.error("Something went wrong while removing email");
    } finally {
      setRemovingEmail(false);
      setRemoveEmailDialogOpen(false);
      setEmailToRemove(null);
    }
  };
  const handleSendNewsletter = async () => {
    if (!newsletterTemplate.subject || !newsletterTemplate.html) {
      toast.error("Please provide both subject and content for the newsletter");
      return;
    }

    setSendingNewsletter(true);
    try {
      const token = localStorage.getItem("adminToken");

      const templateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news-letter/upload-template`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: newsletterTemplate.subject,
            html: newsletterTemplate.html.replace(/\n/g, " "),
          }),
        },
      );

      const templateData = await templateResponse.json();
      console.log(templateData);
      if (templateData.status !== "success") {
        throw new Error(
          templateData.message || "Failed to set newsletter template",
        );
      }

      const sendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news-letter/send-mail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const sendData = await sendResponse.json();
      console.log(sendData);
      if (sendData.status === "success") {
        toast.success("Newsletter sent successfully");
        setNewsletterTemplate({ subject: "", html: "" });
      } else {
        toast.error(sendData.message || "Failed to send newsletter");
      }
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while sending newsletter",
      );
    } finally {
      setSendingNewsletter(false);
    }
  };
  useEffect(() => {
    if (activeTab === "newsletter") {
      console.log("fetching newsletters");
      fetchNewsletterEmails();
    }
  }, [activeTab]);
  return (
    <div className="container md:w-7xl w-xl mx-auto p-6 text-neutral-200 min-h-screen">
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
            onClick={() => fetchApplicants(selectedEventId)}
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
            value="newsletter"
            className="data-[state=active]:bg-blue-600"
            onClick={() => fetchNewsletterEmails()}
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Newsletter
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-neutral-900/60 rounded-xl p-6 border border-neutral-800">
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
                      <option
                        value="team"
                        onClick={() => {
                          fetchApplicants(selectedEventId);
                        }}
                      >
                        Team
                      </option>
                      <option
                        value="solo"
                        onClick={() => {
                          fetchApplicants(selectedEventId);
                        }}
                      >
                        Solo
                      </option>
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
              <div className="border-t border-neutral-800 mt-4 pt-4">
                <h4 className="font-medium text-base mb-3">
                  Upload Event Images
                </h4>
                <p className="text-sm text-neutral-400 mb-3">
                  Upload up to 10 images for the selected event. These will be
                  displayed on the event page.
                </p>

                <div className="space-y-4">
                  <select
                    className="bg-neutral-900/60 border border-neutral-700 rounded-md px-3 py-2 w-full"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-col gap-4">
                    <FileInput
                      onChange={(e) =>
                        setEventImages(Array.from(e.target.files))
                      }
                      multiple={true}
                    />

                    {eventImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.from(eventImages).map((file, index) => (
                          <div
                            key={index}
                            className="relative group bg-neutral-800 rounded-md overflow-hidden h-20 w-20"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              onClick={() => {
                                setEventImages((prev) =>
                                  prev.filter((_, i) => i !== index),
                                );
                              }}
                              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                              <X className="h-6 w-6 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={() => handleImageUpload(selectedEventId)}
                      disabled={
                        !selectedEventId ||
                        eventImages.length === 0 ||
                        uploadingImages
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white w-fit"
                    >
                      {uploadingImages ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        "Upload Images"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3">
              <div className="bg-neutral-900/60 rounded-xl p-6 border border-neutral-800">
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
                              {event.registrationOpen ? (
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-2">
                                  <Check className="w-3 h-3 mr-1" />
                                  Registration Open
                                </div>
                              ) : (
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-700 text-neutral-300 mb-2">
                                  Registration Closed
                                </div>
                              )}
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
          <div className="bg-neutral-900/60 rounded-xl p-6 border border-neutral-800">
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
                  className="bg-neutral-800 border border-neutral-700 rounded-md px-3 text-sm"
                  value={selectedEventId}
                  onChange={(e) => handleEventSelection(e.target.value)}
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedEventId && (
              <Tabs defaultValue="team" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-neutral-800">
                  <TabsTrigger
                    value="team"
                    className="data-[state=active]:bg-blue-600"
                  >
                    Team Applicants
                  </TabsTrigger>
                  <TabsTrigger
                    value="solo"
                    className="data-[state=active]:bg-blue-600"
                  >
                    Solo Applicants
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="team">
                  {loadingApplicants ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : teamApplicants.length === 0 ? (
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
                        No team registrations found for this event.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex justify-between items-center">
                        <span className="text-sm text-neutral-400">
                          {teamApplicants.length} teams registered
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const selected = teamApplicants.filter((app) =>
                                selectedApplicants.includes(app._id),
                              );
                              if (selected.length === 0) {
                                toast.error("No applicants selected");
                                return;
                              }
                              setEmailDialogOpen(true);
                            }}
                            disabled={selectedApplicants.length === 0}
                            className="flex items-center gap-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border-blue-800"
                          >
                            <Mail className="w-4 h-4" />
                            Email Selected
                          </Button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-neutral-800">
                              <th className="text-left py-3 px-4 font-medium text-neutral-300 w-10">
                                <Checkbox
                                  checked={
                                    teamApplicants.length > 0 &&
                                    selectedApplicants.length ===
                                      teamApplicants.length
                                  }
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedApplicants(
                                        teamApplicants.map((app) => app._id),
                                      );
                                    } else {
                                      setSelectedApplicants([]);
                                    }
                                  }}
                                />
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-neutral-300">
                                Team Name
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-neutral-300">
                                Team Leader
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-neutral-300">
                                Members
                              </th>
                              <th className="text-center py-3 px-4 font-medium text-neutral-300">
                                Status
                              </th>
                              <th className="text-center py-3 px-4 font-medium text-neutral-300">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamApplicants
                              .filter(
                                (app) =>
                                  app.teamName
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase()) ||
                                  app.teamLeader?.name
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase()) ||
                                  app.college
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase()),
                              )
                              .map((applicant) => (
                                <tr
                                  key={applicant._id}
                                  className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                                >
                                  <td className="py-3 px-4">
                                    <Checkbox
                                      checked={selectedApplicants.includes(
                                        applicant._id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedApplicants([
                                            ...selectedApplicants,
                                            applicant._id,
                                          ]);
                                        } else {
                                          setSelectedApplicants(
                                            selectedApplicants.filter(
                                              (id) => id !== applicant._id,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    {applicant.teamName}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div>{applicant.teamLeader?.name}</div>
                                    <div className="text-sm text-neutral-400">
                                      {applicant.teamLeader?.email}
                                    </div>
                                    <div className="text-sm text-neutral-400">
                                      {applicant.teamLeader?.mobileNumber}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    {applicant.members?.length || 1}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    {applicant.isMailSent ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        <Check className="w-3 h-3 mr-1" />
                                        Email Sent
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 bg-neutral-800 hover:bg-neutral-700"
                                        onClick={() => {
                                          setSelectedApplicantDetails(
                                            applicant,
                                          );
                                          setViewDetailsOpen(true);
                                        }}
                                      >
                                        <FileEdit className="h-4 w-4" />
                                        <span className="sr-only">
                                          View details
                                        </span>
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-800"
                                        onClick={() => {
                                          setApplicantToDelete({
                                            id: applicant._id,
                                            type: "team",
                                          });
                                          setDeleteDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="solo">
                  {loadingApplicants ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : soloApplicants.length === 0 ? (
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
                        No solo registrations found for this event.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex justify-between items-center">
                        <span className="text-sm text-neutral-400">
                          {soloApplicants.length} participants registered
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const selected = soloApplicants.filter((app) =>
                                selectedApplicants.includes(app._id),
                              );
                              if (selected.length === 0) {
                                toast.error("No applicants selected");
                                return;
                              }
                              setEmailDialogOpen(true);
                            }}
                            disabled={selectedApplicants.length === 0}
                            className="flex items-center gap-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border-blue-800"
                          >
                            <Mail className="w-4 h-4" />
                            Email Selected
                          </Button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-neutral-800">
                              <th className="text-left py-3 px-4 font-medium text-neutral-300 w-10">
                                <Checkbox
                                  checked={
                                    soloApplicants.length > 0 &&
                                    selectedApplicants.length ===
                                      soloApplicants.length
                                  }
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedApplicants(
                                        soloApplicants.map((app) => app._id),
                                      );
                                    } else {
                                      setSelectedApplicants([]);
                                    }
                                  }}
                                />
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-neutral-300">
                                Name
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-neutral-300">
                                Email
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-neutral-300">
                                Mobile
                              </th>
                              <th className="text-center py-3 px-4 font-medium text-neutral-300">
                                Status
                              </th>
                              <th className="text-center py-3 px-4 font-medium text-neutral-300">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {soloApplicants
                              .filter(
                                (app) =>
                                  app.name
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase()) ||
                                  app.email
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase()) ||
                                  app.college
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase()),
                              )
                              .map((applicant) => (
                                <tr
                                  key={applicant._id}
                                  className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                                >
                                  <td className="py-3 px-4">
                                    <Checkbox
                                      checked={selectedApplicants.includes(
                                        applicant._id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedApplicants([
                                            ...selectedApplicants,
                                            applicant._id,
                                          ]);
                                        } else {
                                          setSelectedApplicants(
                                            selectedApplicants.filter(
                                              (id) => id !== applicant._id,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    {applicant.name}
                                  </td>
                                  <td className="py-3 px-4">
                                    {applicant.email}
                                  </td>
                                  <td className="py-3 px-4">
                                    {applicant.mobileNumber}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    {applicant.isMailSent ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        <Check className="w-3 h-3 mr-1" />
                                        Email Sent
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 bg-neutral-800 hover:bg-neutral-700"
                                        onClick={() => {
                                          setSelectedApplicantDetails(
                                            applicant,
                                          );
                                          setViewDetailsOpen(true);
                                        }}
                                      >
                                        <FileEdit className="h-4 w-4" />
                                        <span className="sr-only">
                                          View details
                                        </span>
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-800"
                                        onClick={() => {
                                          setApplicantToDelete({
                                            id: applicant._id,
                                            type: "solo",
                                          });
                                          setDeleteDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
          {/* Email Template Dialog */}
          <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
            <DialogContent className="bg-neutral-900 text-white border-neutral-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Email to Selected Applicants</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  Create an email template to send to all selected applicants
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <LabelInputContainer>
                  <Label htmlFor="emailSubject">Email Subject*</Label>
                  <Input
                    id="emailSubject"
                    placeholder="Subject line for your email"
                    value={emailTemplate.subject}
                    onChange={(e) =>
                      setEmailTemplate({
                        ...emailTemplate,
                        subject: e.target.value,
                      })
                    }
                    className="bg-neutral-800"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="emailHTML">Email Content (HTML)*</Label>
                  <Textarea
                    id="emailHTML"
                    placeholder="Enter HTML content for your email"
                    rows={10}
                    value={emailTemplate.html}
                    onChange={(e) =>
                      setEmailTemplate({
                        ...emailTemplate,
                        html: e.target.value,
                      })
                    }
                    className="bg-neutral-800 font-mono text-sm"
                  />
                </LabelInputContainer>

                <div className="bg-neutral-800 p-3 rounded-md text-sm text-neutral-400">
                  <p>You can use HTML tags to format your email. Example:</p>
                  <code className="text-blue-400 block mt-2 bg-neutral-950 p-2 rounded">
                    &lt;h1&gt;Congratulations!&lt;/h1&gt;
                    <br />
                    &lt;p&gt;You have been selected for &lt;b&gt;Event
                    Name&lt;/b&gt;&lt;/p&gt;
                  </code>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEmailDialogOpen(false)}
                  className="bg-neutral-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendBulkEmail}
                  disabled={
                    !emailTemplate.subject ||
                    !emailTemplate.html ||
                    sendingBulkEmail
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {sendingBulkEmail ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Emails"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-neutral-900 text-white border-neutral-800">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p className="py-4">
                Are you sure you want to delete this applicant? This action
                cannot be undone.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="bg-neutral-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteApplicant}
                  disabled={deletingApplicant}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deletingApplicant ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Applicant Details Dialog */}
          {selectedApplicantDetails && (
            <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
              <DialogContent className="bg-neutral-900 text-white border-neutral-800 max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Applicant Details</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {/* Solo applicant details */}
                  {!selectedApplicantDetails.teamName && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LabelInputContainer>
                          <Label>Name</Label>
                          <div className="bg-neutral-800 rounded-md p-2">
                            {selectedApplicantDetails.name}
                          </div>
                        </LabelInputContainer>
                        <LabelInputContainer>
                          <Label>Email</Label>
                          <div className="bg-neutral-800 rounded-md p-2">
                            {selectedApplicantDetails.email}
                          </div>
                        </LabelInputContainer>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LabelInputContainer>
                          <Label>Mobile Number</Label>
                          <div className="bg-neutral-800 rounded-md p-2">
                            {selectedApplicantDetails.mobileNumber}
                          </div>
                        </LabelInputContainer>
                        <LabelInputContainer>
                          <Label>Git Hub</Label>
                          <div className="bg-neutral-800 rounded-md p-2">
                            {selectedApplicantDetails.githubLink}
                          </div>
                        </LabelInputContainer>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LabelInputContainer>
                          <Label>Department</Label>
                          <div className="bg-neutral-800 rounded-md p-2">
                            {selectedApplicantDetails.department}
                          </div>
                        </LabelInputContainer>
                        <LabelInputContainer>
                          <Label>Year</Label>
                          <div className="bg-neutral-800 rounded-md p-2">
                            {selectedApplicantDetails.year}
                          </div>
                        </LabelInputContainer>
                      </div>
                      <LabelInputContainer>
                        <Label>Registration Date</Label>
                        <div className="bg-neutral-800 rounded-md p-2">
                          {formatDate(selectedApplicantDetails.createdAt)}
                        </div>
                      </LabelInputContainer>
                    </div>
                  )}

                  {/* Team applicant details */}
                  {selectedApplicantDetails.teamName && (
                    <div className="space-y-4">
                      <LabelInputContainer>
                        <Label>Team Name</Label>
                        <div className="bg-neutral-800 rounded-md p-2">
                          {selectedApplicantDetails.teamName}
                        </div>
                      </LabelInputContainer>

                      <div className="space-y-2">
                        <Label>Team Leader</Label>
                        <div className="bg-neutral-800 rounded-md p-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <LabelInputContainer>
                              <Label className="text-sm text-neutral-400">
                                Name
                              </Label>
                              <div className="bg-neutral-900 rounded-md p-2">
                                {selectedApplicantDetails.teamLeader?.name}
                              </div>
                            </LabelInputContainer>
                            <LabelInputContainer>
                              <Label className="text-sm text-neutral-400">
                                Email
                              </Label>
                              <div className="bg-neutral-900 rounded-md p-2">
                                {selectedApplicantDetails.teamLeader?.email}
                              </div>
                            </LabelInputContainer>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <LabelInputContainer>
                              <Label className="text-sm text-neutral-400">
                                Mobile
                              </Label>
                              <div className="bg-neutral-900 rounded-md p-2">
                                {
                                  selectedApplicantDetails.teamLeader
                                    ?.mobileNumber
                                }
                              </div>
                            </LabelInputContainer>
                            <LabelInputContainer>
                              <Label className="text-sm text-neutral-400">
                                GitHub
                              </Label>
                              <div className="bg-neutral-900 rounded-md p-2">
                                {
                                  selectedApplicantDetails.teamLeader
                                    ?.githubLink
                                }
                              </div>
                            </LabelInputContainer>
                          </div>
                        </div>
                      </div>

                      {selectedApplicantDetails.members &&
                        selectedApplicantDetails.members.length > 0 && (
                          <div className="space-y-2">
                            <Label>Team Members</Label>
                            <div className="space-y-3">
                              {selectedApplicantDetails.members.map(
                                (member, index) => (
                                  <div
                                    key={index}
                                    className="bg-neutral-800 rounded-md p-4 space-y-3"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <LabelInputContainer>
                                        <Label className="text-sm text-neutral-400">
                                          Name
                                        </Label>
                                        <div className="bg-neutral-900 rounded-md p-2">
                                          {member.name}
                                        </div>
                                      </LabelInputContainer>
                                      <LabelInputContainer>
                                        <Label className="text-sm text-neutral-400">
                                          Email
                                        </Label>
                                        <div className="bg-neutral-900 rounded-md p-2">
                                          {member.email}
                                        </div>
                                      </LabelInputContainer>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      <LabelInputContainer>
                        <Label>Registration Date</Label>
                        <div className="bg-neutral-800 rounded-md p-2">
                          {formatDate(selectedApplicantDetails.createdAt)}
                        </div>
                      </LabelInputContainer>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setViewDetailsOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* Event Settings Tab */}
        <TabsContent value="newsletter" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900/60 rounded-xl p-6 border border-neutral-800">
              <h3 className="font-medium text-xl mb-4">
                Newsletter Subscribers
              </h3>
              <p className="text-neutral-400 text-sm mb-6">
                Manage your newsletter subscribers list
              </p>

              {newsletterLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : newsletterEmails.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-800 rounded-lg">
                  <Mail className="h-12 w-12 mx-auto text-neutral-700 mb-4" />
                  <p className="text-neutral-400">
                    No newsletter subscribers found.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <Input
                      placeholder="Search emails..."
                      className="bg-neutral-800 border-neutral-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="overflow-hidden rounded-md border border-neutral-800">
                    <div className="max-h-[400px] overflow-auto">
                      <table className="w-full">
                        <thead className="bg-neutral-800">
                          <tr>
                            <th className="text-left py-2 px-4 font-medium">
                              Email
                            </th>
                            <th className="text-left py-2 px-4 font-medium">
                              Date
                            </th>
                            <th className="text-right py-2 px-4 font-medium">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {newsletterEmails
                            .filter((item) =>
                              item.email
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()),
                            )
                            .map((item, index) => (
                              <tr
                                key={index}
                                className="border-t border-neutral-800"
                              >
                                <td className="py-2 px-4">{item.email}</td>
                                <td className="py-2 px-4">
                                  {formatDate(item.createdAt)}
                                </td>
                                <td className="py-2 px-4 text-right">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-900/20"
                                    onClick={() => {
                                      setEmailToRemove(item.email);
                                      setRemoveEmailDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {newsletterTotalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={newsletterPage === 1}
                        onClick={() => {
                          const newPage = Math.max(1, newsletterPage - 1);
                          setNewsletterPage(newPage);
                          fetchNewsletterEmails(newPage);
                        }}
                        className="bg-neutral-800 border-neutral-700"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center px-4 text-sm">
                        Page {newsletterPage} of {newsletterTotalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={newsletterPage === newsletterTotalPages}
                        onClick={() => {
                          const newPage = Math.min(
                            newsletterTotalPages,
                            newsletterPage + 1,
                          );
                          setNewsletterPage(newPage);
                          fetchNewsletterEmails(newPage);
                        }}
                        className="bg-neutral-800 border-neutral-700"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-neutral-900/60 rounded-xl p-6 border border-neutral-800">
              <h3 className="font-medium text-xl mb-4">Send Newsletter</h3>
              <p className="text-neutral-400 text-sm mb-6">
                Create and send emails to all your newsletter subscribers
              </p>

              <div className="space-y-4">
                <LabelInputContainer>
                  <Label htmlFor="newsletterSubject">Email Subject*</Label>
                  <Input
                    id="newsletterSubject"
                    placeholder="Newsletter subject line"
                    value={newsletterTemplate.subject}
                    onChange={(e) =>
                      setNewsletterTemplate({
                        ...newsletterTemplate,
                        subject: e.target.value,
                      })
                    }
                    className="bg-neutral-800"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="newsletterContent">
                    Email Content (HTML)*
                  </Label>
                  <Textarea
                    id="newsletterContent"
                    placeholder="Enter HTML content for your newsletter"
                    rows={10}
                    value={newsletterTemplate.html}
                    onChange={(e) =>
                      setNewsletterTemplate({
                        ...newsletterTemplate,
                        html: e.target.value,
                      })
                    }
                    className="bg-neutral-800 font-mono text-sm"
                  />
                </LabelInputContainer>

                <div className="bg-neutral-800 p-3 rounded-md text-sm text-neutral-400">
                  <p>
                    You can use HTML tags to format your newsletter. Example:
                  </p>
                  <code className="text-blue-400 block mt-2 bg-neutral-950 p-2 rounded">
                    &lt;h1&gt;Newsletter Title&lt;/h1&gt;
                    <br />
                    &lt;p&gt;Welcome to our &lt;b&gt;latest
                    update&lt;/b&gt;!&lt;/p&gt;
                  </code>
                </div>

                <Button
                  onClick={handleSendNewsletter}
                  disabled={
                    !newsletterTemplate.subject ||
                    !newsletterTemplate.html ||
                    sendingNewsletter ||
                    newsletterEmails.length === 0
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer mt-4"
                >
                  {sendingNewsletter ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending to {newsletterEmails.length} subscribers...
                    </span>
                  ) : (
                    `Send Newsletter to ${newsletterEmails.length} Subscribers`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <Dialog
          open={removeEmailDialogOpen}
          onOpenChange={setRemoveEmailDialogOpen}
        >
          <DialogContent className="bg-neutral-900 text-white border-neutral-800">
            <DialogHeader>
              <DialogTitle>Confirm Removal</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Are you sure you want to remove{" "}
              <span className="font-semibold">{emailToRemove}</span> from the
              newsletter subscribers list?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRemoveEmailDialogOpen(false)}
                className="bg-neutral-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRemoveEmail}
                disabled={removingEmail}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {removingEmail ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Removing...
                  </span>
                ) : (
                  "Remove"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
