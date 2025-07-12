// app/layout.tsx
import './globals.css'; // Your global Tailwind CSS
import { Manrope, Noto_Sans } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-manrope',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans',
});

export const metadata = {
  title: "HealthSync",
  description: "Connect with doctors by specialty",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${notoSans.variable}`}>
        {children}
      </body>
    </html>
  );
}