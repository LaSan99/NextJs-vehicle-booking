"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhyChoose from "./components/WhyChoose";
import DownloadApp from "./components/DownloadApp";
import HeroSection from "./components/HeroSection";
import VehicleCard from "./components/VehicleCard";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    setIsLoggedIn(!!token);
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600 animate-pulse">Loading amazing vehicles for you...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      <HeroSection isLoggedIn={isLoggedIn} />
      <WhyChoose />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8" id="vehicles">
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 mb-12 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-lg text-blue-700">
                  Please login or register to book a vehicle.
                  <Link href="/login" className="font-medium underline ml-2 hover:text-blue-800 transition-colors duration-300">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Available Vehicles
          </h1>
          <div className="bg-blue-50 rounded-full px-4 py-2">
            <span className="text-blue-600 font-medium">{vehicles.length} vehicles available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} isLoggedIn={isLoggedIn} />
          ))}
        </div>

        {/* test */}

        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No vehicles available at the moment.</p>
          </div>
        )}
      </main>

      <DownloadApp />
      <Footer />
    </div>
  );
}
