'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import VehicleForm from '@/app/components/VehicleForm';
import Navbar from '@/app/components/Navbar';
import Footer from "../../components/Footer";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Set to true since this is admin dashboard

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoggedIn(true);
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token) => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setVehicles(data.vehicles);
        setBookings(data.bookings);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData(token);
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData(token);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleAddVehicle = async (vehicleData) => {
    const token = Cookies.get('token');
    try {
      const response = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: vehicleData.name,
          model: vehicleData.model,
          year: vehicleData.year,
          licensePlate: vehicleData.licensePlate,
          pricePerDay: vehicleData.pricePerDay,
          seatCount: vehicleData.seatCount,
          images: vehicleData.images || []
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add vehicle');
      }

      setShowAddVehicle(false);
      fetchDashboardData(token);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the vehicle from the local state
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
        setDeleteConfirm(null);
      } else {
        // Show error message to user
        alert(data.error || 'Failed to delete vehicle');
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('An error occurred while deleting the vehicle');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the booking from the local state
        setBookings(bookings.filter(b => b.id !== bookingId));
        setDeleteConfirmBooking(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('An error occurred while deleting the booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-16 h-16 mb-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <div className="relative">
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-ping absolute -left-4"></div>
            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-ping absolute -right-4"></div>
          </div>
          <div className="text-xl text-gray-600 mt-4 font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vehicles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              Users
            </button>
          </nav>
        </div>

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Vehicles</h2>
              <button
                onClick={() => setShowAddVehicle(true)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Vehicle
              </button>
            </div>

            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            License Plate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map((vehicle) => (
                          <tr key={vehicle.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                                <div className="text-sm text-gray-500">{vehicle.model} - {vehicle.year}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{vehicle.licensePlate}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {vehicle.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <select
                                onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                                value={vehicle.status}
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-4"
                              >
                                <option value="AVAILABLE">Available</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="BOOKED">Booked</option>
                              </select>
                              
                              {deleteConfirm === vehicle.id ? (
                                <div className="inline-flex items-center space-x-2">
                                  <button
                                    onClick={() => handleDelete(vehicle.id)}
                                    className="text-red-600 hover:text-red-900 font-medium"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(vehicle.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.user.name}</div>
                        <div className="text-sm text-gray-500">{booking.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">Phone:</span> {booking.phoneNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Address:</span>
                          <p className="whitespace-pre-wrap">{booking.address}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.vehicle.name}</div>
                        <div className="text-sm text-gray-500">{booking.vehicle.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.startDate).toLocaleDateString()} - 
                          {new Date(booking.endDate).toLocaleDateString()}
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
                          }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(booking.id, 'APPROVED')}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking.id, 'REJECTED')}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {deleteConfirmBooking === booking.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="text-red-600 hover:text-red-900 font-medium"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmBooking(null)}
                                className="text-gray-600 hover:text-gray-900 font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmBooking(booking.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Users</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <VehicleForm
              onSubmit={async (data) => {
                await handleAddVehicle(data);
              }}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
} 