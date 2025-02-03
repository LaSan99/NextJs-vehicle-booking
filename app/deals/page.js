"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Deals() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const deals = [
    {
      id: 1,
      title: "Weekend Special",
      description: "Get 30% off on weekend rentals",
      validUntil: "2024-12-31",
      code: "WEEKEND30",
      image: "/weeksale.jpg",
      terms: "Valid for rentals from Friday to Sunday",
    },
    {
      id: 2,
      title: "Special Prices",
      description: "10% off for rentals longer than a week",
      validUntil: "2024-12-31",
      code: "SPECIAL10",
      image: "/store-3867742_1280.jpg",
      terms: "Minimum rental period of 7 days",
    },
    {
      id: 3,
      title: "First-time Renter",
      description: "10% off on your first rental",
      validUntil: "2024-12-31",
      code: "FIRST10",
      image: "/discount-1015443_1280.jpg",
      terms: "For new customers only",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Special Offers & Deals</h1>
          <p className="text-xl text-blue-100 mb-8">
            Save big with our exclusive promotions and discounts
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors duration-300"
          >
            Browse Vehicles
          </Link>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{deal.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 mb-4">{deal.description}</p>
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <p className="text-sm font-medium text-gray-900 mb-1">Promo Code:</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-blue-600">{deal.code}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Valid until: {deal.validUntil}
                  </p>
                  <p className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {deal.terms}
                  </p>
                </div>
                <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section with Enhanced Design */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Latest Deals
            </h2>
            <p className="text-blue-100 mb-8">
              Subscribe to our newsletter and never miss out on exclusive offers
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
              />
              <button className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 