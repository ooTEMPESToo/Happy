// types/index.ts

export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  availability: string;
  consultation_fee: number;
  avatar_url: string;
}
