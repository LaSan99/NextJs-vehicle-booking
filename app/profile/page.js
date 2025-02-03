"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsLoggedIn(true);
    fetchUserProfile(token);
  }, [router]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setBookings(data.bookings);
        // Set isAdmin based on user role
        setIsAdmin(data.user.role === "ADMIN");
      } else {
        // Clear both localStorage and cookies on error
        localStorage.removeItem("token");
        Cookies.remove("token");
        setIsLoggedIn(false);
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Clear both localStorage and cookies on error
      localStorage.removeItem("token");
      Cookies.remove("token");
      setIsLoggedIn(false);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        <div className="flex flex-col items-center justify-center h-screen">
          {/* Profile Card Skeleton */}
          <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
            {/* Loading Animation */}
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar Pulse */}
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
              
              {/* Text Lines Animation */}
              <div className="w-full space-y-3">
                <div className="h-4 bg-gray-200 rounded-md w-1/4 mx-auto animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded-md w-1/2 mx-auto animate-pulse"></div>
              </div>

              {/* Loading Spinner */}
              <div className="flex items-center space-x-2 mt-4">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
              </div>
              <div className="text-sm text-gray-500 mt-2">Loading your profile...</div>
            </div>

            {/* Bookings Table Skeleton */}
            <div className="mt-8">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {user && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <div className="text-lg font-medium text-gray-900">{user.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <div className="text-lg font-medium text-gray-900">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                    ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Booking History
            </h3>
            <Link
              href="/book"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              New Booking
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.vehicle.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.vehicle.model}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            booking.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new booking.
                </p>
                <div className="mt-6">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    New Booking
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
