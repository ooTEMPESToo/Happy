import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturesOverview from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-inter">v
      <Header />
      <main>
        <Hero />
        <FeaturesOverview />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}