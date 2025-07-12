// app/register/page.tsx
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f9fcf9] flex items-center justify-center">
      <AuthForm type="register" />
    </div>
  );
}
