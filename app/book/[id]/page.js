"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from "next/image";
import Footer from "../../components/Footer";
import Navbar from "@/app/components/Navbar";

export default function BookVehicle({ params }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    phoneNumber: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsLoggedIn(true);
    fetchVehicleDetails();
  }, [params.id, router]);

  const fetchVehicleDetails = async () => {
    try {
      const response = await fetch(`/api/vehicles/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
      } else {
        setError("Vehicle not found");
      }
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      setError("Error loading vehicle details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsBooking(true);

    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: params.id,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          phoneNumber: bookingData.phoneNumber,
          address: bookingData.address,
        }),
      });

      if (response.ok) {
        router.push("/profile");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("An error occurred while creating the booking");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative w-full h-96 bg-gray-200 animate-pulse"></div>

            {/* Thumbnail Skeletons */}
            <div className="mt-4 flex gap-2 p-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {/* Title and Details Skeleton */}
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>

              {/* Form Skeleton */}
              <div className="space-y-6">
                {/* Loading Indicator */}
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <div className="text-center text-sm text-gray-500">Loading vehicle details...</div>

                {/* Form Fields Skeleton */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                ))}

                {/* Buttons Skeleton */}
                <div className="flex justify-end space-x-3">
                  <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-24 h-10 bg-blue-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-red-600 mb-4">{error}</div>
            <Link
              href="/"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {vehicle && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {vehicle.images && vehicle.images.length > 0 && (
              <div className="mb-6">
                <div className="relative w-full h-96">
                  <Image
                    src={vehicle.images[selectedImage].url}
                    alt={`${vehicle.name} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </div>

                {vehicle.images.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto p-2">
                    {vehicle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden 
                          ${selectedImage === index 
                            ? 'ring-2 ring-blue-500' 
                            : 'ring-1 ring-gray-200'}`}
                      >
                        <Image
                          src={image.url}
                          alt={`${vehicle.name} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Book {vehicle.name}
              </h2>
              <div className="mb-6">
                <p className="text-gray-600">
                  <span className="font-medium">Model:</span> {vehicle.model}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Year:</span> {vehicle.year}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingData.startDate}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        startDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    required
                    min={
                      bookingData.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    value={bookingData.endDate}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        endDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    required
                    value={bookingData.phoneNumber}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    required
                    value={bookingData.address}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isBooking ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                          <span>Booking...</span>
                        </div>
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
