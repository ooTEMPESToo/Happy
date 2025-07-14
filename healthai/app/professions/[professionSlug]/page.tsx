import Link from "next/link";
import { professions } from "../../data/mockData";
import DoctorCard from "../../../components/DoctorCard";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

interface DoctorsPageProps {
  params: {
    professionSlug: string;
  };
}
export default function DoctorsPage({ params }: DoctorsPageProps) {
  const { professionSlug } = params;
  const profession = professions.find((p) => p.slug === professionSlug);

  // If no profession matches the slug, show a 404 page
  if (!profession) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className=" min-h-screen p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-900">
            {profession.name}
          </h1>
          <p className="text-green-700 mt-2">
            Choose from our top-rated specialists.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {profession.doctors.map((doctor) => (
            <Link
              href={`/professions/${professionSlug}/${doctor.id}`}
              key={doctor.id}
            >
              <DoctorCard doctor={doctor} />
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
