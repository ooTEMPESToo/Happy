type Props = { name: string };

export default function SpecialtyCard({ name }: Props) {
  return (
    <div className="p-4 bg-white shadow rounded-lg hover:shadow-md cursor-pointer border border-green-200">
      <h2 className="text-lg font-semibold text-green-800">{name}</h2>
    </div>
  );
}
