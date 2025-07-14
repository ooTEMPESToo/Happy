import DashboardLayout from "@/components/DashboardLayout";
import { professions } from "../../../data/mockData";
import DoctorDetail from "@/components/DoctorDetail";
import { notFound } from "next/navigation";
interface DoctorDetailPageProps {
  params: {
    professionSlug: string;
    doctorId: string;
  };
}
export default function DoctorDetailPage({ params }: DoctorDetailPageProps) {
  const { professionSlug, doctorId } = params;
  const profession = professions.find((p) => p.slug === professionSlug);
  const doctor = profession?.doctors.find((d) => d.id === doctorId);

  // If no doctor matches the ID, show a 404 page
  if (!doctor) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className=" min-h-screen">
        <DoctorDetail doctor={doctor} />
      </div>
    </DashboardLayout>
  );
}
