"use client";// app/login/page.tsx
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f9fcf9] flex items-center justify-center">
      <AuthForm type="login" />
    </div>
  );
}
