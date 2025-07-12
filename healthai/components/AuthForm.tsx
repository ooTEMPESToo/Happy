"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const isLogin = type === "login";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    history: "",
    profile_image_url: "", // Added new state for profile image URL
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            age: form.age,
            gender: form.gender,
            history: form.history,
            // Include profile_image_url in the payload if it's for registration
            profile_image_url: form.profile_image_url, 
          };

      const res = await fetch(
        `http://localhost:5000/api/auth/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (isLogin) {
        Cookies.set("token", data.token, { expires: 7 });
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-green-100"
      >
        <h1 className="text-2xl font-semibold text-green-700 mb-4 text-center">
          {isLogin ? "Login to HealthAI" : "Register your HealthAI account"}
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
              className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              name="history"
              placeholder="Medical History"
              value={form.history}
              onChange={handleChange}
              required
              className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* NEW: Optional Profile Image URL input */}
            <input
              type="url" // Use type="url" for URL input
              name="profile_image_url"
              placeholder="Profile Image URL (Optional)"
              value={form.profile_image_url}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition-all"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-700">
          {isLogin ? (
            <>
              Do not have an account?{" "}
              <a href="/register" className="text-green-600 underline">
                Register
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="text-green-600 underline">
                Login
              </a>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
