"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Locations() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const locations = [
    {
      id: 1,
      name: "Downtown Branch",
      address: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      hours: "Mon-Sat: 8AM-8PM",
      image: "/map1.jpg",
    },
    {
      id: 2,
      name: "Airport Terminal",
      address: "Terminal 2, International Airport",
      phone: "(555) 234-5678",
      hours: "24/7",
      image: "/map2.jpg",
    },
    {
      id: 3,
      name: "Shopping Mall Center",
      address: "456 Mall Avenue, Shopping District",
      phone: "(555) 345-6789",
      hours: "Mon-Sun: 9AM-9PM",
      image: "/map3.jpg",
    },
    {
      id: 4,
      name: "Business District",
      address: "789 Corporate Blvd, Business Zone",
      phone: "(555) 456-7890",
      hours: "Mon-Fri: 7AM-10PM",
      image: "/map4.jpg",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Locations</h1>
          <p className="text-xl text-blue-100">
            Find AutoRent at convenient locations across the city
          </p>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={location.image}
                  alt={`Map location for ${location.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Location Pin Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <svg 
                      className="w-12 h-12 text-red-600 drop-shadow-lg animate-bounce"
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                    </svg>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {location.name}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location.address}
                  </p>
                  <p className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {location.phone}
                  </p>
                  <p className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {location.hours}
                  </p>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Help Finding Us?
            </h2>
            <p className="text-gray-600 mb-8">
              Contact our support team for assistance in locating your nearest AutoRent branch
            </p>
            <button className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 