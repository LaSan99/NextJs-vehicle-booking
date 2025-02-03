import Image from "next/image";
import Link from "next/link";

export default function VehicleCard({ vehicle, isLoggedIn }) {
  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative w-full h-48">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0].url}
            alt={vehicle.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-semibold text-gray-900">{vehicle.name}</h3>
          <div className="text-xl font-bold text-blue-600">
            ${vehicle.pricePerDay}<span className="text-sm text-gray-500">/day</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-base text-gray-600">
            <span className="font-medium text-gray-800">Model:</span> {vehicle.model}
          </p>
          <p className="text-base text-gray-600">
            <span className="font-medium text-gray-800">Year:</span> {vehicle.year}
          </p>
          <p className="text-base text-gray-600">
            <span className="font-medium text-gray-800">Seats:</span> {vehicle.seatCount}
          </p>
          <p className="text-base">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${vehicle.status === "AVAILABLE"
                ? "bg-green-100 text-green-800 ring-2 ring-green-50"
                : "bg-red-100 text-red-800 ring-2 ring-red-50"}`}
            >
              {vehicle.status}
            </span>
          </p>
        </div>
        {isLoggedIn && vehicle.status === "AVAILABLE" && (
          <div className="mt-8">
            <Link
              href={`/book/${vehicle.id}`}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl"
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 