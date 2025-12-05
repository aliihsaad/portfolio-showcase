
export interface Project {
  id: number;
  titleLeft: string[];
  titleRight: string[];
  description: string[]; // New field for the right-side description text
  subtitle?: string;
  year: string;
  images: string[]; // Changed from single string to array
  bgColor: string; // Hex or tailwind class
  textColor: string; // 'text-white' or 'text-black'
  accentColor: string;
  videoUrl?: string; // Optional video preview
}
