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
import { motion } from "framer-motion";

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

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSection isLoggedIn={isLoggedIn} />
      </motion.div>
      
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <WhyChoose />
      </motion.div>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8" id="vehicles">
        {!isLoggedIn && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 mb-12 rounded-lg shadow-md"
          >
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
          </motion.div>
        )}

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Available Vehicles
          </h1>
          <div className="bg-blue-50 rounded-full px-4 py-2">
            <span className="text-blue-600 font-medium">{vehicles.length} vehicles available</span>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              variants={fadeInUp}
            >
              <VehicleCard vehicle={vehicle} isLoggedIn={isLoggedIn} />
            </motion.div>
          ))}
        </motion.div>

        {vehicles.length === 0 && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-600">No vehicles available at the moment.</p>
          </motion.div>
        )}
      </main>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <DownloadApp />
      </motion.div>
      <Footer />
    </div>
  );
}
