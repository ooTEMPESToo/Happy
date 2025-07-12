"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Doctor } from "@/utils/types";
import DoctorCard from "@/components/professionalhelp/DoctorCard";

export default function SpecialtyPage() {
  const params = useParams();
  const specialty = decodeURIComponent((params?.specialty || "") as string);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/specialty/${specialty}`);
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, [specialty]);

  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-2xl font-semibold mb-4 text-green-700">Doctors - {specialty}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
