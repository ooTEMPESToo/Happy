import Image from "next/image";
import Link from "next/link";

type Props = {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    profilePic: string;
  };
};

export default function DoctorCard({ doctor }: Props) {
  return (
    <div className="bg-white p-4 shadow rounded-lg border border-gray-200 hover:shadow-md">
      <Image src={doctor.profilePic} alt={doctor.name} className="h-32 w-32 object-cover rounded-full mb-4 mx-auto" />
      <h2 className="text-lg font-semibold text-center text-green-700">{doctor.name}</h2>
      <p className="text-sm text-center text-gray-600">{doctor.specialty}</p>
      <Link href={`/professional/doctor/${doctor.id}`}>
        <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          View Profile
        </button>
      </Link>
    </div>
  );
}
