"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function Glimpses () {
  const [expandedSections, setExpandedSections] = useState({});
  const [lightbox, setLightbox] = useState({
    open: false,
    imageUrl: "",
    title: "",
    currentIndex: 0,
    images: [],
    sectionId: null,
  });
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/images/events/all`,
        );
        const result = await response.json();

        if (result.status === "success") {
          const formattedData = result.data
            .filter((event) => event.images && event.images.length > 0)
            .map((event) => ({
              id: event._id,
              title: event.title,
              description: event.description,
              images: event.images.map((imgUrl, index) => ({
                id: index + 1,
                src: imgUrl,
                alt: `${event.title} image ${index + 1}`,
                title: `${event.title} - Image ${index + 1}`,
              })),
            }));

          setGalleryData(formattedData);
        } else {
          setError("Failed to fetch gallery data");
        }
      } catch (err) {
        setError("An error occurred while fetching gallery data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };
  const openLightbox = (imageUrl, title, sectionImages, sectionId) => {
    const currentIndex = sectionImages.findIndex((img) => img.src === imageUrl);
    setLightbox({
      open: true,
      imageUrl,
      title,
      currentIndex,
      images: sectionImages,
      sectionId,
    });
    document.body.style.overflow = "hidden";
  };

  const navigateSlideshow = (direction) => {
    const { currentIndex, images } = lightbox;
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }

    const newImage = images[newIndex];
    setLightbox({
      ...lightbox,
      imageUrl: newImage.src,
      title: newImage.title,
      currentIndex: newIndex,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.open) return;

      if (e.key === "ArrowRight") {
        navigateSlideshow("next");
      } else if (e.key === "ArrowLeft") {
        navigateSlideshow("prev");
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const closeLightbox = () => {
    setLightbox({ open: false, imageUrl: "", title: "" });
    document.body.style.overflow = "auto";
  };

  return (
    <div className="gallery-container px-4 py-12 md:px-6 lg:px-8 container mx-auto">
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-purple-300 transition-colors"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigateSlideshow("prev");
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigateSlideshow("next");
            }}
          >
            <ChevronRight size={24} />
          </button>

          <div
            className="max-w-5xl w-full max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="object-contain w-full h-auto max-h-[80vh]"
                width={1200}
                height={800}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                <h4 className="text-xl font-medium">{lightbox.title}</h4>
                <p className="text-sm text-white/70">
                  {lightbox.currentIndex + 1} of {lightbox.images.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && galleryData.length === 0 && (
        <div className="text-center py-20">
          <p className="text-purple-200/60">No gallery images available yet.</p>
        </div>
      )}
      {galleryData.map((section) => (
        <div key={section.id} className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text mb-2">
              {section.title}
            </h2>
            <p className="text-purple-100/60 max-w-2xl mx-auto text-sm md:text-base">
              {section.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-5 gap-2">
            {section.images
              .slice(
                0,
                expandedSections[section.id] ? section.images.length : 8,
              )
              .map((image, index) => {
                let spanClass;
                if (index % 7 === 0) {
                  spanClass = "col-span-1 sm:col-span-2 md:col-span-2";
                } else if (index % 5 === 0) {
                  spanClass = "col-span-1 sm:col-span-1 md:col-span-1";
                } else if (index % 3 === 0) {
                  spanClass = "col-span-1 sm:col-span-1 md:col-span-1";
                } else {
                  spanClass = "col-span-1";
                }
                const isMobile =
                  typeof window !== "undefined" && window.innerWidth < 640;
                const aspectRatio = isMobile
                  ? "100%"
                  : index % 7 === 0
                    ? "56.25%"
                    : index % 5 === 0
                      ? "100%"
                      : index % 3 === 0
                        ? "80%"
                        : "100%";

                return (
                  <div key={image.id} className={`${spanClass}`}>
                    <div
                      className="relative overflow-hidden rounded-sm
                        bg-purple-900/10 shadow-lg border border-purple-500/10
                        transition-all duration-300 hover:shadow-2xl h-full"
                      onClick={() =>
                        openLightbox(
                          image.src,
                          image.title,
                          section.images,
                          section.id,
                        )
                      }
                    >
                      <div
                        className="relative w-full overflow-hidden h-[345px] rounded-lg"
                        style={{ paddingBottom: aspectRatio }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          fill="true"
                          sizes="(max-width: 500px) 50vw, (max-width: 600px) 25vw, 22vw"
                          className="absolute inset-0 object-cover transition-transform duration-500 hover:scale-110"
                        />

                        {/* Always visible text overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                          <h4 className="text-white font-medium text-sm">
                            {image.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* View More Button */}
          {section.images.length > 9 && (
            <div className="mt-8 text-center">
              <button
                className="group inline-flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 py-2 px-4 rounded-md transition-all duration-200"
                onClick={() => toggleSection(section.id)}
              >
                <span>
                  {expandedSections[section.id] ? "Show Less" : "View More"}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    expandedSections[section.id] ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
