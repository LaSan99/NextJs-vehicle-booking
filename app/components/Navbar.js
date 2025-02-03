"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Navbar({
  isLoggedIn,
  isAdmin,
  showAuthButtons = true,
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
            >
              {/* Simple Car Logo */}
              <svg 
                className="w-8 h-8" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M21.739 10.921c-1.347-.39-1.885-.538-3.552-.921l-2.225-2.489c-.484-.53-1.184-.828-1.912-.828h-4.1c-.728 0-1.429.298-1.912.828l-2.225 2.489c-1.667.383-2.205.531-3.552.921-1.326.389-2.261 1.57-2.261 2.946v3.133c0 .753.321 1.429.834 1.898.145.737.504 1.399 1.015 1.93.927.953 2.23 1.547 3.676 1.547 2.055 0 3.859-1.211 4.475-3h1c.616 1.789 2.42 3 4.475 3 1.446 0 2.749-.594 3.676-1.547.511-.531.87-1.193 1.015-1.93.513-.469.834-1.145.834-1.898v-3.133c0-1.376-.935-2.557-2.261-2.946zm-15.739 6.079c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm11 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm-5.5-14c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"/>
              </svg>
              <span>AutoRent</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/locations"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Locations
            </Link>
            <Link
              href="/deals"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Deals
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              About
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          {showAuthButtons && (
            <div className="hidden md:flex items-center space-x-6">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-medium"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              Vehicles
            </Link>
            <Link
              href="/locations"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              Locations
            </Link>
            <Link
              href="/deals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              Deals
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              About
            </Link>

            {showAuthButtons && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
