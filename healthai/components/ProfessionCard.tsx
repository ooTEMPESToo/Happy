import { Profession } from '@/app/types'; // Adjust path if needed

interface ProfessionCardProps {
  profession: Profession;
}

export default function ProfessionCard({ profession }: ProfessionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 text-center cursor-pointer border border-green-100">
      <h2 className="text-2xl font-semibold text-green-800">{profession.name}</h2>
    </div>
  );
}