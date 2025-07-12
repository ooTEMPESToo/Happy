"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie to manage tokens

export default function Navbar() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to store user profile data (name, email)
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const token = Cookies.get("token"); // Get the authentication token from cookies

    const fetchUserProfile = async () => {
      if (token) {
        try {
          // Make an API call to your backend's /api/auth/profile endpoint
          const res = await fetch("http://localhost:5000/api/auth/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          });

          if (res.ok) {
            // If the request is successful, parse the user data
            const data = await res.json();
            setUserProfile(data); // Set the user profile state
            setIsLoggedIn(true); // Set logged in status to true
          } else {
            // If the token is invalid or expired, or any other error occurs
            // Log out the user by removing the token and resetting states
            Cookies.remove("token");
            setIsLoggedIn(false);
            setUserProfile(null);
            console.error("Failed to fetch user profile:", await res.text());
          }
        } catch (error) {
          // Handle network errors or other exceptions during the fetch
          console.error("Error fetching user profile:", error);
          Cookies.remove("token"); // Clear token on network error
          setIsLoggedIn(false);
          setUserProfile(null);
        }
      } else {
        // If no token is found, ensure logged out state
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    };

    fetchUserProfile();
    // The empty dependency array ensures this effect runs only once after the initial render
  }, []);

  // Function to get the first letter of the user's name for the profile picture
  const getProfileInitial = () => {
    if (userProfile && userProfile.name) {
      return userProfile.name.charAt(0).toUpperCase();
    }
    return "U"; // Default initial if name is not available
  };

  return (
    <header className="flex items-center justify-between border-b border-[#f0f4f0] px-6 md:px-10 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 text-green-600">
          {/* SVG for HealthAI logo */}
          <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-tight text-[#111811]">
          HealthAI
        </h2>
      </div>

      {/* Links Section */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#111811]">
        <a href="#home" className="hover:text-green-600 transition">
          Home
        </a>
        <a href="#about" className="hover:text-green-600 transition">
          About
        </a>
        <a href="#features" className="hover:text-green-600 transition">
          Features
        </a>
        <a href="#contact" className="hover:text-green-600 transition">
          Contact
        </a>
      </nav>

      {/* Conditional Buttons/Profile Section */}
      <div className="hidden md:flex gap-2 items-center">
        {isLoggedIn && userProfile ? (
          // If logged in, show circular profile picture linked to /profile

          <a
            href="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-200 text-green-800 font-bold text-lg hover:bg-green-300 transition-all cursor-pointer"
          >
            {getProfileInitial()}
          </a>
        ) : (
          // If not logged in, show Get Started and Login/Register buttons
          <>
            <a
              href="/get-started"
              className="px-4 py-2 rounded-full bg-[#19e519] text-sm font-bold text-[#111811] hover:bg-green-500 transition"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="px-4 py-2 rounded-full bg-[#f0f4f0] text-sm font-bold text-[#111811] hover:bg-gray-200 transition"
            >
              Login/Register
            </a>
          </>
        )}
      </div>
    </header>
  );
}
