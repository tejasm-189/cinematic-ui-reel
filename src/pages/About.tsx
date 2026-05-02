import { Reel, type ReelSlide } from '../components/Reel';

const aboutSlides: ReelSlide[] = [
  {
    id: 1,
    title: "About Me",
    subtitle: "Introduction",
    category: "Profile",
    meta1: "Tejas M",
    meta2: "Developer · Auditor",
    image: "/images/image-1121789184350067.avif", // Cinematic background
    profileImage: "/images/tejas.jpg", // Overlayed photo
    description: "I'm a software engineer obsessed with the intersection of performance and privacy. My background in cryptography drives my approach to building modern web systems.",
  },
  {
    id: 2,
    title: "The Passion",
    subtitle: "Cybersecurity",
    category: "Focus",
    meta1: "Security",
    meta2: "Protection · Encryption",
    image: "/images/image-1121790171016635.avif",
    description: "From auditing smart contracts to architecting zero-trust applications, my passion lies in securing the digital landscape.",
  },
  {
    id: 3,
    title: "Expertise",
    subtitle: "Modern Stack",
    category: "Skills",
    meta1: "Engineering",
    meta2: "SolidJS · Vinxi",
    image: "/images/image-1121793037683015.avif",
    description: "Specializing in fine-grained reactivity and server-side optimization to create applications that are as fast as they are secure.",
  },
  {
    id: 4,
    title: "The Vision",
    subtitle: "Innovation",
    category: "Mindset",
    meta1: "2026",
    meta2: "Impact · Growth",
    image: "/images/image-1121796024349383.avif",
    description: "Every line of code I write is intentional, aimed at building a future where digital interactions are seamless, cinematic, and private by default.",
  }
];

export function About() {
  return <Reel slides={aboutSlides} />;
}
