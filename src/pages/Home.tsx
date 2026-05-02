import { Reel, type ReelSlide } from '../components/Reel';

const homeSlides: ReelSlide[] = [
  {
    id: 1,
    title: "Tejas M",
    subtitle: "Digital Craftsman",
    category: "Identity",
    meta1: "2026",
    meta2: "SolidJS · Cybersecurity",
    image: "/images/image-1121789181016734.avif",
    description: "Architecting the future of the web with high-performance frameworks and a fundamental focus on security-first design.",
  },
  {
    id: 2,
    title: "SolidJS Mastery",
    subtitle: "Reactive Engineering",
    category: "Tech Stack",
    meta1: "Vite",
    meta2: "Performance · UI/UX",
    image: "/images/image-1121790164349969.avif",
    description: "Building ultra-fast, fine-grained reactive applications using SolidJS and SolidStart for the ultimate user experience.",
  },
  {
    id: 3,
    title: "Cybersecurity",
    subtitle: "Digital Fortress",
    category: "Expertise",
    meta1: "Infosec",
    meta2: "Protection · Auditing",
    image: "/images/image-1121795404349445.avif",
    description: "Developing robust defensive architectures and conducting deep-dive security audits to protect high-stakes digital assets.",
  },
  {
    id: 4,
    title: "Cryptography",
    subtitle: "Privacy & Encryption",
    category: "Specialization",
    meta1: "Math",
    meta2: "Security · Trust",
    image: "/images/image-1121793034349682.avif",
    description: "Implementing complex cryptographic protocols and algorithms to ensure data integrity and absolute user privacy.",
  },
  {
    id: 5,
    title: "The Award Vision",
    subtitle: "Unforgettable UX",
    category: "Philosophy",
    meta1: "Design",
    meta2: "Cinematic · Interactive",
    image: "/images/image-1121796034349382.avif",
    description: "Creating immersive, award-worthy digital experiences that blend high-end visual effects with seamless functionality.",
  }
];

export function Home() {
  return <Reel slides={homeSlides} />;
}
