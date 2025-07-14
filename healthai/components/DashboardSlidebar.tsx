"use client";

import React from 'react';
// We are using <a> tags for navigation as per previous discussion
// import Link from 'next/link'; // Not used here

interface DashboardSidebarProps {
  userProfile: { name: string; email: string } | null;
  onLogout: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userProfile, onLogout }) => {
  return (
    <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
      <div className="flex flex-col gap-4">
        {/* User Profile in Sidebar */}
        <div className="flex gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            // Placeholder image; ideally, this would be a user-specific avatar or initial
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBW4SnhY_ef-4NZzxJjF0WYWsd0dmc32-tQRKRVJXzv19MhVpm1h8WHnRIyIYb3v6duDakUVz17z6HG3-jh_g_MVQa5KYpXZ-Meu7gtxVKDOMr9IJUhYhyDd6yZKgmxtu43uCVLShuYs0rPhyxq7VSc471S0FROFAQQb_3ykUdZfbTx9rUHCoecnddq1v9MvKluS1dFqkKijo0UyRmaModNsLDnZnNA2FnMJu04lyxoqs_1BnFtjSA_S8WtAaE2kebLR893OMnW6SJf")' }}
          ></div>
          <h1 className="text-[#131712] text-base font-medium leading-normal">
            {userProfile?.name || "Guest User"}
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          {/* Dashboard Link */}
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#f1f4f1] hover:bg-gray-100 transition-colors">
            <div className="text-[#131712]" data-icon="House" data-size="24px" data-weight="fill">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
              </svg>
            </div>
            <p className="text-[#131712] text-sm font-medium leading-normal">Dashboard</p>
          </a>

          {/* Health Check Link */}
          <a href="/prediction" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-[#131712]" data-icon="CheckSquare" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"></path>
              </svg>
            </div>
            <p className="text-[#131712] text-sm font-medium leading-normal">Health Check</p>
          </a>

          {/* Disease Prediction Link */}
          <a href="/prediction" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-[#131712]" data-icon="Brain" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39a56,56,0,0,0,0,101.2V176a48,48,0,0,0,88,26.49A48,48,0,0,0,216,176v-1.41A56.09,56.09,0,0,0,248,124ZM88,208a32,32,0,0,1-31.81-28.56A55.87,55.87,0,0,0,64,180h8a8,8,0,0,0,0-16H64A40,40,0,0,1,50.67,86.27,8,8,0,0,0,56,78.73V72a32,32,0,0,1,64,0v68.26A47.8,47.8,0,0,0,88,128a8,8,0,0,0,0,16,32,32,0,0,1,0,64Zm104-44h-8a8,8,0,0,0,0,16h8a55.87,55.87,0,0,0,7.81-.56A32,32,0,1,1,168,144a8,8,0,0,0,0-16,47.8,47.8,0,0,0-32,12.26V72a32,32,0,0,1,64,0v6.73a8,8,0,0,0,5.33,7.54A40,40,0,0,1,192,164Zm16-52a8,8,0,0,1-8,8h-4a36,36,0,0,1-36-36V80a8,8,0,0,1,16,0v4a20,20,0,0,0,20,20h4A8,8,0,0,1,208,112ZM60,120H56a8,8,0,0,1,0-16h4A20,20,0,0,0,80,84V80a8,8,0,0,1,16,0v4A36,36,0,0,1,60,120Z"></path>
              </svg>
            </div>
            <p className="text-[#131712] text-sm font-medium leading-normal">Disease Prediction</p>
          </a>

          {/* History Link */}
          <a href="/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-[#131712]" data-icon="ClockCounterClockwise" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"></path>
              </svg>
            </div>
            <p className="text-[#131712] text-sm font-medium leading-normal">History</p>
          </a>

          {/* Ask About Health Link */}
          <a href="/ask-ai" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-[#131712]" data-icon="Question" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
              </svg>
            </div>
            <p className="text-[#131712] text-sm font-medium leading-normal">Ask About Health</p>
          </a>

          {/* Daily Health Meter Link */}
          <a href="/professions" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-[#131712]" data-icon="Heart" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
              </svg>
            </div>
            <p className="text-[#131712] text-sm font-medium leading-normal">Daily Health Meter</p>
          </a>
        </div>
      </div>
      {/* Logout button at the bottom of the sidebar */}
      <button
        onClick={onLogout}
        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all font-medium"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardSidebar;
