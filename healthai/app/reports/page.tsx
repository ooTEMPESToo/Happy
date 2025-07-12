"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DashboardLayout from "@/components/DashboardLayout";

// Define interfaces for report data
interface ReportForm {
  report_name: string;
  report_date: string;
  base64_file_content: string; // This must strictly be a string
  file_mime_type: string;
}

interface FetchedReport extends ReportForm {
  _id: string;
  user_id: string;
  uploaded_at: string;
}

export default function MedicalReportsPage() {
  const [reports, setReports] = useState<FetchedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadFormData, setUploadFormData] = useState<ReportForm>({
    report_name: "",
    report_date: "",
    base64_file_content: "", // Initialize new field
    file_mime_type: "", // Initialize new field
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false); // State to toggle upload form visibility

  // Function to fetch all reports for the user
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    const token = Cookies.get("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/history/reports", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        setReports(result.reports);
      } else {
        const errorText = await res.text();
        setError(`Failed to fetch reports: ${errorText}`);
        setReports([]); // Clear reports on error
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Network error or server unreachable while fetching reports.");
      setReports([]); // Clear reports on network error
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Handle change for upload form text/date inputs
  const handleUploadChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUploadFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); // Store the file object

      // Read the file as Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;

        if (typeof result === "string") {
          setUploadFormData((prev) => ({
            ...prev,
            base64_file_content: result,
            file_mime_type: file.type,
          }));
        } else {
          console.error("FileReader result is not a string:", result);
          setUploadFormData((prev) => ({
            ...prev,
            base64_file_content: "", // fallback to empty string
            file_mime_type: "",
          }));
        }
      };

      reader.readAsDataURL(file); // Read file as data URL
    } else {
      setSelectedFile(null);
      setUploadFormData((prev) => ({
        ...prev,
        base64_file_content: "",
        file_mime_type: "",
      }));
    }
  };

  // Handle new report upload submission
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    setError(null);
    setLoading(true);

    const token = Cookies.get("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    if (!selectedFile) {
      setError("Please select a file to upload.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/history/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(uploadFormData),
      });

      if (res.ok) {
        setSubmitMessage("Report uploaded successfully!");
        // Clear form and file selection
        setUploadFormData({
          report_name: "",
          report_date: "",
          base64_file_content: "",
          file_mime_type: "",
        });
        setSelectedFile(null);
        setShowUploadForm(false); // Hide form after successful upload
        fetchReports(); // Re-fetch reports to update the list
      } else {
        const errorText = await res.text();
        setError(`Failed to upload report: ${errorText}`);
      }
    } catch (err) {
      console.error("Error uploading report:", err);
      setError("Network error or server unreachable during report upload.");
    } finally {
      setLoading(false);
    }
  };

  // Handle report deletion
  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSubmitMessage(null);

    const token = Cookies.get("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/history/reports/${reportId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setSubmitMessage("Report deleted successfully!");
        fetchReports(); // Re-fetch reports to update the list
      } else {
        const errorText = await res.text();
        setError(`Failed to delete report: ${errorText}`);
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      setError("Network error or server unreachable during report deletion.");
    } finally {
      setLoading(false);
    }
  };

  const latestReport = reports.length > 0 ? reports[0] : null; // Get the latest report (assuming reports are sorted by date)

  return (
    <DashboardLayout>

    
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight min-w-72">
              Medical Report Analysis
            </p>
          </div>

          {submitMessage && (
            <p className="text-green-600 text-center mb-4">{submitMessage}</p>
          )}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {loading && (
            <p className="text-gray-600 text-center mb-4">Loading reports...</p>
          )}

          {/* Conditional rendering for reports list or upload prompt */}
          {!loading && reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#dee6db] rounded-xl my-8 text-center">
              <p className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
                No medical reports found.
              </p>
              <p className="text-[#6b8961] text-base font-normal leading-normal mb-6">
                Please upload your first medical report to get started.
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#42e311] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-green-600 hover:text-white transition-colors"
              >
                <span className="truncate">Upload New Report</span>
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Previous Reports
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-[40px_1fr_auto] gap-x-2 px-4">
                {reports.map((report, index) => (
                  <React.Fragment key={report._id}>
                    <div className="flex flex-col items-center gap-1 pt-3">
                      <div
                        className="text-[#131811]"
                        data-icon="Calendar"
                        data-size="24px"
                        data-weight="regular"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24px"
                          height="24px"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
                        </svg>
                      </div>
                      {index < reports.length - 1 && (
                        <div className="w-[1.5px] bg-[#dee6db] h-full grow"></div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col py-3">
                      <p className="text-[#131811] text-base font-medium leading-normal">
                        {report.report_name}
                      </p>
                      <p className="text-[#6b8961] text-base font-normal leading-normal">
                        {new Date(
                          report.report_date + "T00:00:00"
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 py-3">
                      {/* Use data URL for viewing PDF */}
                      <a
                        href={report.base64_file_content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f1f4f0] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors"
                      >
                        <span className="truncate">View</span>
                      </a>
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-red-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-600 transition-colors"
                      >
                        <span className="truncate">Delete</span>
                      </button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </>
          )}

          {/* Upload New Report Section */}
          <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Upload New Report
          </h2>
          <div className="flex flex-col p-4">
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dee6db] px-6 py-14">
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                  Upload your medical report
                </p>
                <p className="text-[#131811] text-sm font-normal leading-normal max-w-[480px] text-center">
                  Select a file (PDF, image) and provide details
                </p>
              </div>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f4f0] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors"
              >
                <span className="truncate">
                  {showUploadForm ? "Hide Upload Form" : "Upload File"}
                </span>
              </button>
            </div>
          </div>

          {showUploadForm && (
            <form
              onSubmit={handleUploadSubmit}
              className="p-4 bg-white rounded-lg shadow-md mb-8"
            >
              <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
                New Report Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Report Name
                  </p>
                  <input
                    type="text"
                    name="report_name"
                    value={uploadFormData.report_name}
                    onChange={handleUploadChange}
                    placeholder="e.g., Annual Checkup 2024"
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Report Date
                  </p>
                  <input
                    type="date"
                    name="report_date"
                    value={uploadFormData.report_date}
                    onChange={handleUploadChange}
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <p className="text-[#131811] text-base font-medium leading-normal">
                    Select Report File (PDF/Image)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,image/*" // Accept PDF and any image types
                    onChange={handleFileChange}
                    className="form-input rounded-xl border border-[#dee5dc] bg-white p-[15px] text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    required
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition-all text-lg"
                disabled={loading || !selectedFile} // Disable if loading or no file selected
              >
                {loading ? "Uploading..." : "Submit Report"}
              </button>
            </form>
          )}

          {/* Current Report Section (displays the latest report) */}
          {latestReport && (
            <>
              <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Current Report
              </h2>
              <div className="p-4 @container">
                <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start border border-[#dee6db] p-4">
                  {/* Display a generic icon or message for the report type */}
                  <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold">
                    {latestReport.file_mime_type.includes("pdf")
                      ? "PDF Document"
                      : "Image Report"}
                  </div>
                  <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
                    <p className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em]">
                      {latestReport.report_name}
                    </p>
                    <div className="flex items-end gap-3 justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-[#6b8961] text-base font-normal leading-normal">
                          Report Date:{" "}
                          {new Date(
                            latestReport.report_date + "T00:00:00"
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-[#6b8961] text-base font-normal leading-normal">
                          Uploaded:{" "}
                          {new Date(
                            latestReport.uploaded_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <a
                        href={latestReport.base64_file_content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#42e311] text-[#131811] text-sm font-medium leading-normal hover:bg-green-600 hover:text-white transition-colors"
                      >
                        <span className="truncate">View Report</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Static sections from original HTML (Trend Analysis, Compare, AI Guidance, Feedback) */}
          <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Overall Health Assessment
          </h2>
          <p className="text-[#131811] text-base font-normal leading-normal pb-3 pt-1 px-4">
            Based on your medical history and recent reports, your overall
            health is good. There are no significant concerns, and your key
            health metrics are within normal ranges. Continue with your current
            lifestyle and follow-up with Dr. Hayes for any specific
            recommendations.
          </p>
          <div className="flex flex-wrap gap-4 px-4 py-6">
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dee6db] p-6">
              <p className="text-[#131811] text-base font-medium leading-normal">
                Blood Pressure Trends
              </p>
              <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight truncate">
                120/80 mmHg
              </p>
              <div className="flex gap-1">
                <p className="text-[#6b8961] text-base font-normal leading-normal">
                  Last 12 Months
                </p>
                <p className="text-[#e71f08] text-base font-medium leading-normal">
                  -5%
                </p>
              </div>
              <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
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
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.G15 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                    stroke="#6b8961"
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
                  <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Jan
                  </p>
                  <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Mar
                  </p>
                  <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    May
                  </p>
                  <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Jul
                  </p>
                  <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Sep
                  </p>
                  <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Nov
                  </p>
                </div>
              </div>
            </div>
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dee6db] p-6">
              <p className="text-[#131811] text-base font-medium leading-normal">
                Cholesterol Levels
              </p>
              <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight truncate">
                180 mg/dL
              </p>
              <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                <div
                  className="border-[#6b8961] bg-[#f1f4f0] border-t-2 w-full"
                  style={{ height: "50%" }}
                ></div>
                <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                  Jan
                </p>
                <div
                  className="border-[#6b8961] bg-[#f1f4f0] border-t-2 w-full"
                  style={{ height: "80%" }}
                ></div>
                <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                  Mar
                </p>
                <div
                  className="border-[#6b8961] bg-[#f1f4f0] border-t-2 w-full"
                  style={{ height: "50%" }}
                ></div>
                <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                  May
                </p>
                <div
                  className="border-[#6b8961] bg-[#f1f4f0] border-t-2 w-full"
                  style={{ height: "40%" }}
                ></div>
                <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                  Jul
                </p>
                <div
                  className="border-[#6b8961] bg-[#f1f4f0] border-t-2 w-full"
                  style={{ height: "80%" }}
                ></div>
                <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                  Sep
                </p>
                <div
                  className="border-[#6b8961] bg-[#f1f4f0] border-t-2 w-full"
                  style={{ height: "40%" }}
                ></div>
                <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                  Nov
                </p>
              </div>
            </div>
          </div>
          <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Compare Reports
          </h2>
          <p className="text-[#131811] text-base font-normal leading-normal pb-3 pt-1 px-4">
            Select two reports to compare side-by-side and identify trends in
            your health metrics.
          </p>
          <div className="flex justify-stretch">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f4f0] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors">
                <span className="truncate">Select Reports</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#42e311] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-green-600 hover:text-white transition-colors">
                <span className="truncate">Export as PDF</span>
              </button>
            </div>
          </div>
          <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            AI Guidance
          </h2>
          <p className="text-[#131811] text-base font-normal leading-normal pb-3 pt-1 px-4">
            Upload your medical reports (PDF, image) and ask questions about
            your health. Our AI will analyze your reports and provide
            personalized guidance.
          </p>
          <div className="flex flex-col p-4">
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dee6db] px-6 py-14">
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                  Upload your medical report
                </p>
                <p className="text-[#131811] text-sm font-normal leading-normal max-w-[480px] text-center">
                  Drag and drop or browse to upload your report
                </p>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f4f0] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors">
                <span className="truncate">Browse Files</span>
              </button>
            </div>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <textarea
                placeholder="Ask a question about your health"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#131811] focus:outline-0 focus:ring-0 border border-[#dee6db] bg-white focus:border-[#dee6db] min-h-36 placeholder:text-[#6b8961] p-[15px] text-base font-normal leading-normal"
              ></textarea>
            </label>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#42e311] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-green-600 hover:text-white transition-colors">
              <span className="truncate">Submit Question</span>
            </button>
          </div>
          <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Feedback
          </h3>
          <p className="text-[#131811] text-base font-normal leading-normal pb-3 pt-1 px-4">
            Was this guidance helpful and accurate?
          </p>
          <div className="flex flex-wrap gap-4 px-4 py-2">
            <div className="flex items-center justify-center gap-2 px-3 py-2">
              <div
                className="text-[#6b8961]"
                data-icon="ThumbsUp"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path>
                </svg>
              </div>
              <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                0
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 py-2">
              <div
                className="text-[#6b8961]"
                data-icon="ThumbsDown"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path>
                </svg>
              </div>
              <p className="text-[#6b8961] text-[13px] font-bold leading-normal tracking-[0.015em]">
                0
              </p>
            </div>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <textarea
                placeholder="Optional: Provide written feedback to help us improve"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#131811] focus:outline-0 focus:ring-0 border border-[#dee6db] bg-white focus:border-[#dee6db] min-h-36 placeholder:text-[#6b8961] p-[15px] text-base font-normal leading-normal"
              ></textarea>
            </label>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f4f0] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors">
              <span className="truncate">Submit Feedback</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
