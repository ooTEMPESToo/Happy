export interface Doctor {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience: number;
  details: string;
}

export interface Profession {
  name: string;
  slug: string;
  doctors: Doctor[];
}