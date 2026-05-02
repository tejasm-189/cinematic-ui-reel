import { Reel, type ReelSlide } from '../components/Reel';

const blogSlides: ReelSlide[] = [
  {
    id: 1,
    title: "The Future of Auth",
    subtitle: "Security",
    category: "Deep Dive",
    meta1: "Oct 2025",
    meta2: "Passkeys · Biometrics",
    image: "/images/image-1121789191016733.avif",
    description: "Exploring the fundamental shift from shared secrets to public-key cryptography in modern authentication flows.",
  },
  {
    id: 2,
    title: "Zero Knowledge",
    subtitle: "Cryptography",
    category: "Math",
    meta1: "Sep 2025",
    meta2: "Privacy · Proofs",
    image: "/images/image-1121794107682908.avif",
    description: "How ZK-SNARKs are enabling a new era of verifiable privacy without compromising user data.",
  },
  {
    id: 3,
    title: "SolidJS Reactivity",
    subtitle: "Performance",
    category: "Architecture",
    meta1: "Aug 2025",
    meta2: "JS · DOM",
    image: "/images/image-1121794571016195.avif",
    description: "Analyzing the fine-grained reactivity model of SolidJS and why it's the future of efficient UI rendering.",
  },
  {
    id: 4,
    title: "Digital Craftsmanship",
    subtitle: "Philosophy",
    category: "Personal",
    meta1: "Jul 2025",
    meta2: "Life · Tech",
    image: "/images/image-1121793034349682.avif",
    description: "Reflecting on the difference between writing code and building digital artifacts with intentionality and care.",
  }
];

export function Blog({ showIntro }: { showIntro?: boolean }) {
  return <Reel slides={blogSlides} showIntro={showIntro} />;
}
