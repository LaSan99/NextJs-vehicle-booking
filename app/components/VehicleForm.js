'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VehicleForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    licensePlate: initialData?.licensePlate || '',
    pricePerDay: initialData?.pricePerDay || '',
    seatCount: initialData?.seatCount || '',
  });
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(initialData?.images || []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('You can only upload up to 5 images');
      return;
    }
    
    // Preview images
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(urls);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, upload images to get their URLs
      const imageUploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append('file', image);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        return data.url;
      });

      const uploadedImageUrls = await Promise.all(imageUploadPromises);

      // Submit vehicle data with image URLs
      await onSubmit({
        ...formData,
        images: uploadedImageUrls,
      });

    } catch (error) {
      setError(error.message || 'Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Vehicle Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text"
            id="model"
            required
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="number"
            id="year"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
            License Plate
          </label>
          <input
            type="text"
            id="licensePlate"
            required
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
            Price Per Day ($)
          </label>
          <input
            type="number"
            id="pricePerDay"
            required
            min="0"
            step="0.01"
            value={formData.pricePerDay}
            onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="seatCount" className="block text-sm font-medium text-gray-700">
            Number of Seats
          </label>
          <input
            type="number"
            id="seatCount"
            required
            min="1"
            value={formData.seatCount}
            onChange={(e) => setFormData({ ...formData, seatCount: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Vehicle Images (Up to 5)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload images</span>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
          </div>
        </div>

        {imageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative aspect-w-3 aspect-h-2">
                <Image
                  src={url}
                  alt={`Vehicle image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Vehicle'}
        </button>
      </div>
    </form>
  );
} 