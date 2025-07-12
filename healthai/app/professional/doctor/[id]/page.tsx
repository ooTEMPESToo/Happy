"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Doctor } from "@/utils/types";

export default function DoctorDetailsPage() {
  const params = useParams();
  const doctorId = (params?.id || "") as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor:", err);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (!doctor) return <div>Loading doctor info...</div>;

  return (
    <div className="p-4 text-gray-800">
      <h1 className="text-3xl font-bold text-green-700">{doctor.name}</h1>
      <p className="mt-2 text-gray-600">{doctor.specialty}</p>
      <p className="mt-2">Experience: {doctor.experience}</p>
      <p className="mt-2">Hospital: {doctor.hospital}</p>
      <p className="mt-2">Email: {doctor.email}</p>
      <p className="mt-2">Phone: {doctor.phone}</p>
      <p className="mt-2 text-gray-700">{doctor.description}</p>
      <p className="mt-4 font-semibold">Fees: ₹{doctor.fees}</p>

      {/* Placeholder: Add contact/mail/appointment buttons here */}
    </div>
  );
}
