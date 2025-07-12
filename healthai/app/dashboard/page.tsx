"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// Import the new components
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardFeatureCard from "@/components/DashboardFeatureCard";

// Define a more comprehensive type for the user profile data
interface UserProfile {
  _id?: string; // MongoDB ObjectId as string
  name: string;
  email: string;
  age?: string | number; // Make optional as it might not be provided
  gender?: string; // Make optional
  history?: string; // Make optional
  role?: string;
  created_at?: string; // Assuming it's converted to string for JSON
  profile_image_url?: string; // Added new optional field for profile image URL
  // Add other fields you might want to display
}

const DashboardPage = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility

  // Function to handle user logout
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
        console.error("Logout failed:", errorText);
        setError("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during logout", err);
      setError("An error occurred during logout.");
    }
  };

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Effect to fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login"); // Redirect if no token
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
          setUserProfile(result.user); // Set user profile data
        } else {
          // If fetching profile fails (e.g., token expired/invalid), redirect to login
          Cookies.remove("token");
          router.push("/login");
          console.error("Failed to fetch user profile:", await res.text());
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        Cookies.remove("token"); // Clear token on network error
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
        <p className="text-lg text-green-700">Loading dashboard...</p>
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

  // Function to get the first letter of the user's name for the profile picture
  const getProfileInitial = () => {
    if (userProfile && userProfile.name) {
      return userProfile.name.charAt(0).toUpperCase();
    }
    return 'U'; // Default initial if name is not available
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Left Sidebar - Conditional rendering based on isSidebarOpen */}
          <div className={`${isSidebarOpen ? "w-80" : "w-0 overflow-hidden"} transition-all duration-300 ease-in-out flex flex-col`}>
            <DashboardSidebar userProfile={userProfile} onLogout={handleLogout} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          </div>

          {/* Main Content Area - Adjust max-width and flex-1 based on sidebar state */}
          <div className={`layout-content-container flex flex-col ${isSidebarOpen ? "max-w-[calc(100%-320px)] flex-1" : "max-w-full flex-1"} transition-all duration-300 ease-in-out`}>
            {/* Toggle button for sidebar on the main content side */}
            <button
              onClick={toggleSidebar}
              className="absolute top-5 left-6 md:left-[320px] z-20 p-2 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors"
              style={{ left: isSidebarOpen ? '320px' : '24px' }} // Adjust position based on sidebar state
            >
              {isSidebarOpen ? (
                // SVG for closing (left arrow or similar)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
              ) : (
                // SVG for opening (right arrow or similar)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              )}
            </button>

            {/* User Profile Header Section */}
            <div className="flex p-4 @container mt-10"> {/* Added mt-10 to account for toggle button */}
              <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex gap-4">
                  {/* Conditional Profile Image/Initial Display */}
                  {userProfile?.profile_image_url ? (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                      style={{ backgroundImage: `url("${userProfile.profile_image_url}")` }}
                    ></div>
                  ) : (
                    <div className="flex items-center justify-center min-h-32 w-32 rounded-full bg-green-200 text-green-800 font-bold text-5xl">
                      {getProfileInitial()}
                    </div>
                  )}
                  
                  <div className="flex flex-col justify-center">
                    <p className="text-[#131712] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      {userProfile?.name || "User Name"}
                    </p>
                    <p className="text-[#6d8566] text-base font-normal leading-normal">
                      {userProfile?.age && `Age: ${userProfile.age}`}
                      {userProfile?.gender && ` | Gender: ${userProfile.gender}`}
                      {userProfile?.history && ` | Medical History: ${userProfile.history}`}
                      {/* Placeholder for BMI and Blood Type if not provided by backend */}
                      {(!userProfile?.age && !userProfile?.gender && !userProfile?.history) && (
                        "Age: N/A | BMI: N/A | Blood Type: N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-[#131712] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Your Health Overview</h2>
            
            {/* Feature Cards Section */}
            <DashboardFeatureCard
              title="Health Check"
              description="Schedule or view your health check results."
              link="/prediction"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCchm8dHqWNf4rTCCXzcC2WtK-n-QDyJlv3xlhaQfBvL42-9fv3r5FHatAn6mbzQykefzm-1UvfnVfbsov7GMf1RZGAxlDtzjMct0LXrCLJ-qe5GyRTGdld0QmSgZkBHepLbxfDYykOOd0N5cz6Q6Q6U3BcUJwJzFEgh-g6QKosHiyJuiz2iXOcQpzOh0Chg4QbqUlZ-zXlYau1Cu2dGrfnEFHvjjLw0I1hGuns-d9zZBFdBHD2C6hetnq_oRPpPxodixChi_dZ5wpRpp"
              buttonText="View Details"
            />
            <DashboardFeatureCard
              title="Disease Prediction"
              description="Access tools to predict potential health risks."
              link="/prediction"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCTXa9hsq7TFctKrpIVjdQCeRz-VT2HQATmPWmP-WX66Q5SkXq1QuLQ_qYi5S2a_5KWwqp9M2iPlAgoleu_qzvvGmO66y08X59cZ7Ge57Yd3vtvM_LigPfYbLg50yu2dJSk6mtmoW2mQSkT3ucX9F27nJpjlUX3HVJAh8Ijsc4i5TlGH6gb_doCh-e5BbvlS8R4gnhCQ5fVsGt7IYLrCG-0-Y8jiCyjNI78TlsOyuJEDeXy-4lcL2nCMXoNW4PHcS4jEqOy4uv0rppR"
              buttonText="Explore"
            />
            <DashboardFeatureCard
              title="History"
              description="Review your past health activities and reports."
              link="/reports"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDejFgie-mucwoi17Y3ke-mXXudPsCanZ9Omc1Y58ch2D4pu_SXnxuZ4ajclhVPcNx-I_55DXaFaxiK_lwiSKwTVkyw59EAD-Q2hK_JH_NGu32Q_uhuXC2M1Hm-vMH0VCs1mbB8S-gYur9Q7m__NnDA-4bYeLi4gPqQd3YUtEit2OipOxlWjUFwLCo5acIUx0hbAOdLqJYBxHOirw9N73P29jGwovj18vT2_vZzbw97ecO6SWqfSy1RNaMDLS9ZODp1XtiY-bQ-pWoK"
              buttonText="View History"
            />
            <DashboardFeatureCard
              title="Ask About Health"
              description="Get answers to your health questions."
              link="/ask-ai"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDaY8t_ELkUIMYzvbsWe8Rd9Q-8Qe9KwxiV4MwQC1YaydnyP6Ym1EG6WebDri_DYb9-wufOXgHmN1lONVwI3AfhtEV1Frcb0BJ049gBb5GOcDapG7p3_9NqIH_ovyTpxbQbV6vIkGNm8_WV9fxPhtQJSJzsLv30w4NO8ZjSHV2Dt5p9UiPCyzcoTjusUjbs-crdXLmOk1m4C9mbkP8WhYHrruZlF_VQGkKz2SzOcnriinhPMZF0g_CXfaoztEUhqZb7aqt7YNVUz2pe"
              buttonText="Ask Now"
            />
            <DashboardFeatureCard
              title="Daily Health Meter"
              description="Track your daily activity and health metrics."
              link="/daily-health-meter"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuA5owXQ3q1wJ65gaGLA3q8xafXJouUXV2PjfinnBVrF08NLaKSt_q-q8Bm9G-rsVZzDBdSozi7GCHRsXT3PsYBHd0-m7IIbqYBpwcWWp3WWjXFW9_mxCPu4OxYKDd2rztXOxWCFgYQtlA_7JqDy3IR7gFwaPScARk7Dno6ptXCGCHXfKLrrQLsfoqB8FzPLV8iBlmOjlNcdAKJ_STxG3DhyjRcmCiVQIHz-OdnyzTb4sQdFLJQZjl6Aoy684mgUjZ4EHC1t1U2PQPfW"
              buttonText="View Meter"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
