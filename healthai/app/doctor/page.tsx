// app/professional/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  avatar_url: string;
}

export default function ProfessionalLandingPage() {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/doctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = (await res.json()) as { doctors: Doctor[] };
        if (data.doctors) {
          const uniqueSpecialties = Array.from(
            new Set(data.doctors.map((doc: Doctor) => doc.specialty))
          );
          setSpecialties(uniqueSpecialties);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Browse by Specialization</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {specialties.map((specialty) => (
          <Link
            key={specialty}
            href={`/professional/${encodeURIComponent(specialty)}`}
            className="bg-white hover:shadow-lg transition-shadow duration-300 p-6 rounded-xl border text-center"
          >
            <h2 className="text-xl font-semibold capitalize text-green-700">
              {specialty}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
