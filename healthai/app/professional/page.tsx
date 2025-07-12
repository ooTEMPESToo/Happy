"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import SpecialtyCard from "@/components/professionalhelp/SpecialtyCard";

export default function ProfessionalPage() {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/specialties")
      .then((res) => setSpecialties(res.data))
      .catch((err) => console.error("Error fetching specialties:", err));
  }, []);

  const filtered = specialties.filter((spec) =>
    spec.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Find a Specialist</h1>
      <input
        type="text"
        placeholder="Search specialties..."
        className="border px-4 py-2 rounded-md mb-6 w-full max-w-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((specialty) => (
          <Link href={`/professional/${specialty}`} key={specialty}>
            <SpecialtyCard name={specialty} />
          </Link>
        ))}
      </div>
    </div>
  );
}
