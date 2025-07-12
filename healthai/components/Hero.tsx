import Image from "next/image";
import landingpic from "../pics/landingpic.png"; // Adjust the path as necessary
const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-16 px-6 md:px-12 lg:py-24 font-inter">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
            Your AI Healthcare <br className="hidden md:inline" /> Companion
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto lg:mx-0">
            Empowering you with AI-driven disease prediction, medical history
            tracking, and seamless doctor consultations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              Try It Now
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full shadow-md hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
          {/* Placeholder image for the hero section */}
          <Image
            src={landingpic}
            alt="AI Healthcare Companion"
            className="rounded-xl shadow-2xl w-full max-w-lg object-cover"
            
          />
        </div>
      </div>
    </section>
  );
};
export default Hero;
