import Link from "next/link";
import Image from "next/image";

export default function HeroSection({ isLoggedIn }) {
  return (
    <div className="relative bg-gray-900 h-[500px] mb-12">
      <div className="absolute inset-0">
        <Image
          src="/hero-car.jpg"
          alt="Luxury vehicle fleet"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
          Premium Vehicle Booking
        </h1>
        <p className="mt-6 text-xl text-gray-100 max-w-3xl">
          Experience luxury and comfort with our premium vehicle fleet. Book your dream car today and enjoy a seamless journey with our professional service.
        </p>
        {isLoggedIn ? (
          <button 
            onClick={() => document.getElementById('vehicles').scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105"
          >
            View Available Vehicles
          </button>
        ) : (
          <Link
            href="/login"
            className="mt-8 inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
} 