"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // For accessing the token
import DashboardLayout from "@/components/DashboardLayout";

// Define interfaces for health data
interface HealthData {
  total_cholesterol: string;
  hdl_cholesterol: string;
  ldl_cholesterol: string;
  blood_pressure: string;
  weight: string;
  height: string;
  diabetes_status: string;
  injury_description: string;
  injury_date: string;
  injury_severity: string;
}

// Interface for fetched data (might include _id, timestamp etc.)
interface FetchedHealthData extends HealthData {
  _id: string;
  user_id: string;
  timestamp: string;
}

export default function HealthCheckPage() {
  const [formData, setFormData] = useState<HealthData>({
    total_cholesterol: "",
    hdl_cholesterol: "",
    ldl_cholesterol: "",
    blood_pressure: "",
    weight: "",
    height: "",
    diabetes_status: "",
    injury_description: "",
    injury_date: "",
    injury_severity: "",
  });

  const [latestHealthData, setLatestHealthData] =
    useState<FetchedHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest health data on component mount
  useEffect(() => {
    const fetchLatestHealthData = async () => {
      setLoading(true);
      setError(null);
      const token = Cookies.get("token");
      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/predict/latest-health-check",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const result = await res.json();
          if (result.data) {
            setLatestHealthData(result.data);
            // Pre-fill form with fetched data if it exists
            setFormData({
              total_cholesterol: result.data.total_cholesterol || "",
              hdl_cholesterol: result.data.hdl_cholesterol || "",
              ldl_cholesterol: result.data.ldl_cholesterol || "",
              blood_pressure: result.data.blood_pressure || "",
              weight: result.data.weight || "",
              height: result.data.height || "",
              diabetes_status: result.data.diabetes_status || "",
              injury_description: result.data.injury_description || "",
              injury_date: result.data.injury_date || "",
              injury_severity: result.data.injury_severity || "",
            });
          } else {
            setLatestHealthData(null); // No data found
          }
        } else if (res.status === 404) {
          setLatestHealthData(null); // Explicitly set null if no data found
        } else {
          const errorText = await res.text();
          setError(`Failed to fetch health data: ${errorText}`);
        }
      } catch (err) {
        console.error("Error fetching latest health data:", err);
        setError(
          "Network error or server unreachable while fetching health data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestHealthData();
  }, []); // Empty dependency array means this runs once on mount

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    setError(null);
    setLoading(true); // Set loading while submitting

    const token = Cookies.get("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/predict/health-check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setSubmitMessage("Health data submitted successfully!");
        // Re-fetch latest data to update display after successful submission
        const updatedRes = await fetch(
          "http://localhost:5000/api/predict/latest-health-check",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (updatedRes.ok) {
          const updatedResult = await updatedRes.json();
          setLatestHealthData(updatedResult.data);
        } else {
          setError(
            "Submitted data, but failed to re-fetch latest. Please refresh."
          );
        }
      } else {
        const errorText = await res.text();
        setError(`Failed to submit health data: ${errorText}`);
      }
    } catch (err) {
      console.error("Error submitting health data:", err);
      setError("Network error or server unreachable during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div
        className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
        style={
          {
            "--select-button-svg": `url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(107,136,99)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')`,
            fontFamily: 'Manrope, "Noto Sans", sans-serif',
          } as React.CSSProperties
        }
      >
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Health Check Report
              </p>
            </div>

            {submitMessage && (
              <p className="text-green-600 text-center mb-4">{submitMessage}</p>
            )}
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            {loading && (
              <p className="text-gray-600 text-center mb-4">Loading data...</p>
            )}

            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white rounded-lg shadow-md mb-8"
            >
              <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
                Enter Your Health Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Total Cholesterol (mg/dL)
                  </p>
                  <input
                    type="number"
                    name="total_cholesterol"
                    value={formData.total_cholesterol}
                    onChange={handleChange}
                    placeholder="e.g., 200"
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    HDL Cholesterol (mg/dL)
                  </p>
                  <input
                    type="number"
                    name="hdl_cholesterol"
                    value={formData.hdl_cholesterol}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    LDL Cholesterol (mg/dL)
                  </p>
                  <input
                    type="number"
                    name="ldl_cholesterol"
                    value={formData.ldl_cholesterol}
                    onChange={handleChange}
                    placeholder="e.g., 130"
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Blood Pressure (mmHg)
                  </p>
                  <input
                    type="text" // Use text to allow "120/80" format
                    name="blood_pressure"
                    value={formData.blood_pressure}
                    onChange={handleChange}
                    placeholder="e.g., 120/80"
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Weight (lbs)
                  </p>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g., 150"
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Height (e.g., 5&apos; 6&apos;)
                  </p>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="e.g., 5'6"
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                  />
                </label>
                <label className="flex flex-col gap-1 col-span-full">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Diabetes Status
                  </p>
                  <select
                    name="diabetes_status"
                    value={formData.diabetes_status}
                    onChange={handleChange}
                    className="appearance-none form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base bg-[image:var(--select-button-svg)] bg-no-repeat bg-[right_1rem_center] pr-10"
                  >
                    <option value="">Select Status</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="Pre-diabetic">Pre-diabetic</option>
                  </select>
                </label>
              </div>

              <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
                Recent Injuries (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 col-span-full">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Injury Description
                  </p>
                  <textarea
                    name="injury_description"
                    value={formData.injury_description}
                    onChange={handleChange}
                    placeholder="Describe the injury"
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base min-h-24"
                  ></textarea>
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Date of Injury
                  </p>
                  <input
                    type="date" // Changed to date type for date picker
                    name="injury_date"
                    value={formData.injury_date}
                    onChange={handleChange}
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Severity
                  </p>
                  <select
                    name="injury_severity"
                    value={formData.injury_severity}
                    onChange={handleChange}
                    className="appearance-none form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base bg-[image:var(--select-button-svg)] bg-no-repeat bg-[right_1rem_center] pr-10"
                  >
                    <option value="">Select severity</option>
                    <option value="Minor">Minor</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition-all text-lg"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Health Data"}
              </button>
            </form>

            {/* Display Latest Health Data if available */}
            {latestHealthData && (
              <>
                <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                  Key Health Indicators
                </h3>
                <div className="p-4 grid grid-cols-2">
                  <div className="flex flex-col gap-1 border-t border-solid border-t-[#dee5dc] py-4 pr-2">
                    <p className="text-[#6b8863] text-sm font-normal leading-normal">
                      Total Cholesterol
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.total_cholesterol || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-solid border-t-[#dee5dc] py-4 pl-2">
                    <p className="text-[#6b8863] text-sm font-normal leading-normal">
                      HDL Cholesterol
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.hdl_cholesterol || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-solid border-t-[#dee5dc] py-4 pr-2">
                    <p className="text-[#6b8863] text-sm font-normal leading-normal">
                      LDL Cholesterol
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.ldl_cholesterol || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-solid border-t-[#dee5dc] py-4 pl-2">
                    <p className="text-[#6b8863] text-sm font-normal leading-normal">
                      Blood Pressure
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.blood_pressure || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-solid border-t-[#dee5dc] py-4 pr-2">
                    <p className="text-[#6b8863] text-sm font-normal leading-normal">
                      Weight
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.weight
                        ? `${latestHealthData.weight} lbs`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-solid border-t-[#dee5dc] py-4 pl-2">
                    <p className="text-[#6b8863] text-sm font-normal leading-normal">
                      Height
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.height || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-solid border-t-[#dee5dc] py-4 col-span-2 pr-[50%]">
                    <p className="text-[#6b8863] text-sm font-normal leading-normal">
                      Diabetes Status
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.diabetes_status || "N/A"}
                    </p>
                  </div>
                </div>

                <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                  Recent Injuries
                </h3>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-[#131811] text-base font-medium leading-normal pb-2">
                      Injury Description
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.injury_description || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-[#131811] text-base font-medium leading-normal pb-2">
                      Date of Injury
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.injury_date || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-[#131811] text-base font-medium leading-normal pb-2">
                      Severity
                    </p>
                    <p className="text-[#131811] text-sm font-normal leading-normal">
                      {latestHealthData.injury_severity || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Trend Analysis remains static for now, but data is available in latestHealthData.timestamp */}
                <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                  Trend Analysis
                </h3>
                <div className="flex flex-wrap gap-4 px-4 py-6">
                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dee5dc] p-6">
                    <p className="text-[#131811] text-base font-medium leading-normal">
                      Cholesterol Levels Over Time
                    </p>
                    <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight truncate">
                      {latestHealthData.total_cholesterol || "N/A"} mg/dL
                    </p>
                    <div className="flex gap-1">
                      <p className="text-[#6b8863] text-base font-normal leading-normal">
                        Last Recorded:
                      </p>
                      <p className="text-[#078821] text-base font-medium leading-normal">
                        {latestHealthData.timestamp
                          ? new Date(
                              latestHealthData.timestamp
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                      {/* Static SVG for Cholesterol Trend */}
                      <svg
                        width="100%"
                        height="148"
                        viewBox="-3 0 478 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                          fill="url(#paint0_linear_1131_5935)"
                        ></path>
                        <path
                          d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                          stroke="#6b8863"
                          strokeWidth="3"
                          strokeLinecap="round"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_1131_5935"
                            x1="236"
                            y1="1"
                            x2="236"
                            y2="149"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#f1f4f0"></stop>
                            <stop
                              offset="1"
                              stopColor="#f1f4f0"
                              stopOpacity="0"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="flex justify-around">
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Jan
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Feb
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Mar
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Apr
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          May
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Jun
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dee5dc] p-6">
                    <p className="text-[#131811] text-base font-medium leading-normal">
                      Blood Pressure Trends
                    </p>
                    <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight truncate">
                      {latestHealthData.blood_pressure || "N/A"} mmHg
                    </p>
                    <div className="flex gap-1">
                      <p className="text-[#6b8863] text-base font-normal leading-normal">
                        Last Recorded:
                      </p>
                      <p className="text-[#e71f08] text-base font-medium leading-normal">
                        {latestHealthData.timestamp
                          ? new Date(
                              latestHealthData.timestamp
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                      {/* Static SVG for Blood Pressure Trend */}
                      <svg
                        width="100%"
                        height="148"
                        viewBox="-3 0 478 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                          fill="url(#paint0_linear_1131_5935)"
                        ></path>
                        <path
                          d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                          stroke="#6b8863"
                          strokeWidth="3"
                          strokeLinecap="round"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_1131_5935"
                            x1="236"
                            y1="1"
                            x2="236"
                            y2="149"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#f1f4f0"></stop>
                            <stop
                              offset="1"
                              stopColor="#f1f4f0"
                              stopOpacity="0"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="flex justify-around">
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Jan
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Feb
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Mar
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Apr
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          May
                        </p>
                        <p className="text-[#6b8863] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          Jun
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                  Personalized Recommendations
                </h3>
                <p className="text-[#131811] text-base font-normal leading-normal pb-3 pt-1 px-4">
                  Based on your health profile, we recommend incorporating more
                  leafy greens into your diet and engaging in moderate exercise
                  for at least 30 minutes a day to maintain healthy cholesterol
                  levels and blood pressure.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
