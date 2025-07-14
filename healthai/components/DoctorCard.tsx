import Image from 'next/image';
import { Doctor } from '@/app/types'; // Adjust path if needed

// Define the type for the component's props
interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full">
      <div className="relative h-56 w-full">
        <Image src={doctor.image} alt={`Dr. ${doctor.name}`} layout="fill" objectFit="cover" />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-green-900">{doctor.name}</h3>
        <div className="flex justify-between text-green-700 mt-2 text-sm">
          <span>⭐ {doctor.rating}</span>
          <span>{doctor.experience} yrs exp.</span>
        </div>
      </div>
    </div>
  );
}