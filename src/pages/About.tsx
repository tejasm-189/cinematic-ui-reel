import { Reel, type ReelSlide } from '../components/Reel';

const aboutSlides: ReelSlide[] = [
  {
    id: 1,
    title: "ABOUT ME",
    subtitle: "INTRODUCTION",
    category: "PROFILE",
    meta1: "TEJAS M",
    meta2: "FULL STACK · DEVELOPER",
    image: "/images/image-1121789184350067.avif",
    description: "I'm a software developer with a deep interest in cybersecurity and cryptography. My journey in tech has been driven by curiosity about how systems work and how to make them more secure.",
  },
  {
    id: 2,
    title: "THE PASSION",
    subtitle: "CYBERSECURITY",
    category: "FOCUS",
    meta1: "SECURITY",
    meta2: "PROTECTION · ENCRYPTION",
    image: "/images/image-1121790171016635.avif",
    description: "I love exploring the intersection of technology and security, from building secure web applications to understanding cryptographic algorithms.",
  },
  {
    id: 3,
    title: "WHAT I DO",
    subtitle: "EXPERTISE",
    category: "SPECIALTY",
    meta1: "ENGINEERING",
    meta2: "FRONTEND · BACKEND",
    image: "/images/image-1121793037683015.avif",
    description: "I specialize in building secure web applications and exploring cryptographic concepts. My work focuses on implementing security best practices.",
  },
  {
    id: 4,
    title: "TECH STACK",
    subtitle: "TOOLS",
    category: "FRAMEWORKS",
    meta1: "REACT",
    meta2: "SOLID · VITE",
    image: "/images/image-1121794114349574.avif",
    description: "My preferred stack includes React, SolidJS, TypeScript, TailwindCSS, GSAP for motion, and cutting-edge build tools like Vite and Vinxi.",
  },
  {
    id: 5,
    title: "INNOVATION",
    subtitle: "PROBLEM SOLVING",
    category: "MINDSET",
    meta1: "LOGIC",
    meta2: "ALGORITHMS · AI",
    image: "/images/image-1121796024349383.avif",
    description: "I tackle complex challenges with creative solutions and innovative approaches, leveraging AI effectively to speed up development and research.",
  },
  {
    id: 6,
    title: "THE VISION",
    subtitle: "FUTURE",
    category: "GOALS",
    meta1: "2026",
    meta2: "GROWTH · IMPACT",
    image: "/images/image-1121796544349331.avif",
    description: "I aim to build applications that not only look stunning but are fundamentally secure by design from the ground up.",
  },
  {
    id: 7,
    title: "GET IN TOUCH",
    subtitle: "CONNECT",
    category: "CONTACT",
    meta1: "SOCIAL",
    meta2: "GITHUB · LINKEDIN",
    image: "/images/image-1121789181016734.avif",
    description: "Feel free to reach out if you want to collaborate on a project, have questions, or just want to say hi!",
  }
];

export function About() {
  return <Reel slides={aboutSlides} />;
}
