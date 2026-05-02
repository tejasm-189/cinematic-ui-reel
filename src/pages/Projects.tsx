import { Reel, type ReelSlide } from '../components/Reel';

const projectsSlides: ReelSlide[] = [
  {
    id: 1,
    title: "Aura Experience",
    subtitle: "Immersive Portfolio",
    category: "Featured",
    meta1: "2026",
    meta2: "SolidJS · WebGL",
    image: "/images/image-1121789187683400.avif",
    description: "An award-worthy personal ecosystem featuring advanced liquid optics, ray-traced cursor physics, and cinematic transitions.",
  },
  {
    id: 2,
    title: "Crypto Visualizer",
    subtitle: "Algorithm Demo",
    category: "Specialty",
    meta1: "Math",
    meta2: "AES · RSA",
    image: "/images/image-1121791417683177.avif",
    description: "Interactive visualization of complex cryptographic handshakes and encryption flows, making abstract security tangible.",
  },
  {
    id: 3,
    title: "Cyber-Sentinel",
    subtitle: "Threat Dashboard",
    category: "Security",
    meta1: "Infosec",
    meta2: "Real-time · Data",
    image: "/images/image-1121790164349969.avif",
    description: "A high-performance security monitoring interface that parses live network logs into aesthetic, actionable visual data.",
  },
  {
    id: 4,
    title: "Liquid Bento",
    subtitle: "UI Component Lab",
    category: "Interface",
    meta1: "SolidJS",
    meta2: "Bento · Glass",
    image: "/images/image-1121793041016348.avif",
    description: "Exploring the boundaries of glassmorphism with interactive bento-grids that react to scroll and hover with fluid physics.",
  },
  {
    id: 5,
    title: "Secure Pipelines",
    subtitle: "CI/CD Automation",
    category: "DevOps",
    meta1: "Actions",
    meta2: "Security · Deployment",
    image: "/images/image-1121795404349445.avif",
    description: "Architecting automated delivery pipelines with integrated security scanning and automated dependency audits.",
  }
];

export function Projects({ showIntro }: { showIntro?: boolean }) {
  return <Reel slides={projectsSlides} showIntro={showIntro} />;
}
