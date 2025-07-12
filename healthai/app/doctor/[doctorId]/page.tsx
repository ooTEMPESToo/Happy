// app/doctor/[doctorId]/page.tsx
// This component displays details for a single doctor,
// capturing the 'doctorId' from the URL (e.g., /doctor/60d5ec49f8c1b7f0e8b2c1a2).

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner'; // Assuming sonner is available for toasts
import Image from 'next/image';

// Re-using the Doctor interface from your types/index.ts
interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  availability: string;
  consultation_fee: number;
  avatar_url: string;
}

// Define the props for this dynamic page component
interface DoctorDetailsPageProps {
  params: {
    doctorId: string; // This matches the [doctorId] in the folder name
  };
}

export default function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  // Extract the dynamic segment 'doctorId' from the params prop
  const { doctorId } = params;

  // State to hold the fetched doctor data
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch doctor data when the doctorId changes
    if (doctorId) {
      setLoading(true);
      setError(null);
      // In a real application, you would call your backend API to get a single doctor by ID.
      // Your current api/doctors.py doesn't have a direct endpoint for single doctor by ID.
      // For demonstration, we'll simulate fetching from a list or assume an endpoint like /api/doctors/<id>
      // If your backend only has /api/doctors?specialty=X, you'd need to adjust this or add a new backend endpoint.
      axios.get(`/api/doctors?id=${doctorId}`) // Assuming a new endpoint or query param for single doctor
        .then(response => {
          // This mock assumes the API returns a list and we find the doctor.
          // In a real scenario, the API would return the single doctor directly.
          const foundDoctor = response.data.doctors.find((d: Doctor) => d._id === doctorId);
          if (foundDoctor) {
            setDoctor(foundDoctor);
          } else {
            setError("Doctor not found.");
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch doctor:", err);
          setError("Failed to load doctor details.");
          toast.error("Failed to load doctor details.");
          setLoading(false);
        });
    }
  }, [doctorId]); // Re-run effect when doctorId changes

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-medium">
        Loading doctor details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 text-lg">
        Error: {error}
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        Doctor not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl my-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Doctor Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={doctor.avatar_url || `https://placehold.co/100x100/A8DADC/2C3E50?text=Dr`}
            alt={doctor.name}
            className="w-48 h-48 object-cover rounded-full shadow-md"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/100x100/A8DADC/2C3E50?text=Dr`; // Fallback image
            }}
          />
        </div>

        {/* Doctor Details */}
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dr. {doctor.name}
          </h1>
          <p className="text-xl text-indigo-600 font-semibold mb-4">
            Specialty: {doctor.specialty}
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            Experience: {doctor.experience} years
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            Rating: {doctor.rating} / 5
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            Availability: {doctor.availability}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Consultation Fee: ₹{doctor.consultation_fee.toFixed(2)}
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
