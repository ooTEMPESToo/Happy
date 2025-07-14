export const professions = [
  {
    name: 'Dermatology',
    slug: 'dermatology',
    doctors: [
      {
        id: 'doc-jane-smith',
        name: 'Dr. Jane Smith',
        image: '/images/doctor-female.png', // Make sure to add sample images to your /public/images folder
        rating: 4.8,
        experience: 12,
        details: 'Dr. Jane Smith is a board-certified dermatologist with over a decade of experience in both medical and cosmetic dermatology. She is dedicated to providing her patients with the highest standard of care.'
      },
      {
        id: 'doc-emily-white',
        name: 'Dr. Emily White',
        image: '/images/doctor-female-2.png',
        rating: 4.9,
        experience: 9,
        details: 'Dr. Emily White specializes in pediatric dermatology and is known for her compassionate and gentle approach with young patients.'
      }
    ]
  },
  {
    name: 'Cardiology',
    slug: 'cardiology',
    doctors: [
      {
        id: 'doc-john-davis',
        name: 'Dr. John Davis',
        image: '/images/doctor-male.png',
        rating: 4.7,
        experience: 15,
        details: 'Dr. John Davis is a renowned cardiologist, specializing in interventional cardiology and advanced heart failure management. He is committed to improving cardiovascular health through innovative treatments.'
      }
    ]
  }
];