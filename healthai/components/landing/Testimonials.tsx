interface TestimonialCardProps {
  name: string;
  testimonial: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <p className="text-gray-700 text-sm mb-4 italic">"{testimonial}"</p>
      <p className="font-semibold text-gray-800">- {name}</p>
    </div>
  );
};

// components/Testimonials.tsx
const Testimonials = () => {
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50 font-inter">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            name="Sophia M."
            testimonial="HealthAI has been a game-changer for me. The predictions are incredibly accurate, and the doctor consultations are so convenient."
          />
          <TestimonialCard
            name="Ethan L."
            testimonial="I can easily track my medicine history with HealthAI. It's all in one place, and I feel more in control of my health."
          />
          <TestimonialCard
            name="Olivia R."
            testimonial="The privacy-first design of HealthAI gives me peace of mind. I know my data is safe and secure."
          />
        </div>
      </div>
    </section>
  );
};
export default Testimonials;