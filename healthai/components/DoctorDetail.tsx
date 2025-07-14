import Image from 'next/image';
import { Doctor } from '@/app/types'; // Adjust path if needed

interface DoctorDetailProps {
  doctor: Doctor;
}

export default function DoctorDetail({ doctor }: DoctorDetailProps) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="relative h-full min-h-[250px] md:min-h-[350px]">
              <Image src={doctor.image} alt={doctor.name} layout="fill" objectFit="cover" />
            </div>
          </div>
          <div className="md:col-span-2 p-8">
            <h1 className="text-3xl font-extrabold text-green-900 tracking-tight sm:text-4xl">{doctor.name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500 font-bold text-lg">⭐ {doctor.rating}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-green-700 font-semibold">{doctor.experience} years of experience</span>
            </div>
            <p className="mt-6 text-gray-600 text-base">{doctor.details}</p>

            <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-800">Consultation & Payment</h3>
                <p className="text-green-700 mt-1">Ready for your consultation? Book an appointment and proceed with the payment securely.</p>
                <button className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300">
                    Book Appointment - $150
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}