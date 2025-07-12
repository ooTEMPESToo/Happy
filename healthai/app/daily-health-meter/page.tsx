// app/dashboard/page.tsx
import DashboardLayout from "@/components/DashboardLayout";

const page = () => {
  return (
    <DashboardLayout>
      {/* Only include this page's content here now */}
      <div className="mt-10 px-4">
        <h2 className="text-[22px] font-bold text-[#131712]">Your Health Overview</h2>
        {/* Put your DashboardFeatureCards here as-is */}
      </div>
    </DashboardLayout>
  );
};

export default page;
