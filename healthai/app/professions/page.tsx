import Link from "next/link";
import { professions } from "../data/mockData";
import ProfessionCard from "../../components/ProfessionCard";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProfessionsPage() {
  return (
    <DashboardLayout>

    
    <div className=" min-h-screen p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-900">
          Our Medical Professions
        </h1>
        <p className="text-green-700 mt-2">
          Select a profession to find your doctor.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {professions.map((profession) => (
          <Link href={`/professions/${profession.slug}`} key={profession.slug}>
            <ProfessionCard profession={profession} />
          </Link>
        ))}
      </div>
    </div>
    </DashboardLayout>
  );
}
