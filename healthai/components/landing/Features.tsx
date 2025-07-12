import FeatureCard from "./FeatureCards";

const Features = () => {
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50 font-inter">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Features Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            title="Smart Disease Prediction"
            description="Get accurate predictions based on your symptoms."
          />
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            title="Medical History Tracking"
            description="Securely store and manage your medical records."
          />
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M12 20.005v-2.355M12 14.005v-2.355m0-2.355V4.354m0 0a4 4 0 010 5.292m0 0C11.5 11 10 13 10 15c0 1.5 1 2.5 2 2.5s2-1 2-2.5c0-2-1.5-4-2-4.354z" /></svg>}
            title="Doctor Consultation (Free + Paid)"
            description="Connect with certified doctors for consultations."
          />
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-11V9a2 2 0 012-2h4a2 2 0 012 2v2M4 15h16" /></svg>}
            title="Privacy-first Design"
            description="Your data is protected with advanced security measures."
          />
        </div>
      </div>
    </section>
  );
};
export default Features;