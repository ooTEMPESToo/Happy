// components/DashboardLayout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DashboardSidebar from "@/components/DashboardSidebar";

interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  age?: string | number;
  gender?: string;
  history?: string;
  role?: string;
  created_at?: string;
  profile_image_url?: string;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        Cookies.remove("token");
        router.push("/login");
      } else {
        const errorText = await res.text();
        setError("Logout failed. Please try again.");
        console.error("Logout failed:", errorText);
      }
    } catch (err) {
      console.error("Error during logout", err);
      setError("An error occurred during logout.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const result = await res.json();
          setUserProfile(result.user);
        } else {
          Cookies.remove("token");
          router.push("/login");
          console.error("Failed to fetch user profile:", await res.text());
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        Cookies.remove("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-green-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar */}
          <div className={`${isSidebarOpen ? "w-80" : "w-0 overflow-hidden"} transition-all duration-300 ease-in-out flex flex-col`}>
            <DashboardSidebar
              userProfile={userProfile}
              onLogout={handleLogout}
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />
          </div>

          {/* Main content area */}
          <div className={`layout-content-container flex flex-col ${isSidebarOpen ? "max-w-[calc(100%-320px)] flex-1" : "max-w-full flex-1"} transition-all duration-300 ease-in-out`}>
            <button
              onClick={toggleSidebar}
              className="absolute top-5 z-20 p-2 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors"
              style={{ left: isSidebarOpen ? "320px" : "24px" }}
            >
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
              )}
            </button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
