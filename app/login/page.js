"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        Cookies.set("token", data.token, {
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });

        router.push("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/auth-bg.jpg" // Make sure to add this image to your public folder
          alt="Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      </div>

      <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Link
            href="/"
            className="inline-flex items-center text-gray-200 hover:text-white mb-8 group transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-200 text-lg">
              Sign in to access your account
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="appearance-none block w-full px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="appearance-none block w-full px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-200 bg-black/20 backdrop-blur-sm rounded">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/register"
                    className="w-full flex justify-center py-3 px-4 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-300 ease-in-out"
                  >
                    Create new account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
