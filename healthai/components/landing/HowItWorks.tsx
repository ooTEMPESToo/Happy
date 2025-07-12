interface HowItWorksStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <div className="text-green-600 flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-16 px-6 md:px-12 font-inter">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <HowItWorksStep
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
            title="Input Symptoms"
            description="Describe your symptoms in detail."
          />
          <HowItWorksStep
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            title="Get Prediction"
            description="Receive an AI-generated disease prediction."
          />
          <HowItWorksStep
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            title="Save History"
            description="Securely store your medical history."
          />
          <HowItWorksStep
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M12 20.005v-2.355M12 14.005v-2.355m0-2.355V4.354m0 0a4 4 0 010 5.292m0 0C11.5 11 10 13 10 15c0 1.5 1 2.5 2 2.5s2-1 2-2.5c0-2-1.5-4-2-4.354z" /></svg>}
            title="Consult Doctor"
            description="Connect with a doctor for further consultation."
          />
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;