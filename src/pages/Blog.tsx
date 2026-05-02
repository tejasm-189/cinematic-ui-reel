import { Reel, type ReelSlide } from '../components/Reel';

const blogSlides: ReelSlide[] = [
  {
    id: 1,
    title: "THE FUTURE OF AUTH",
    subtitle: "SECURITY",
    category: "ARTICLE",
    meta1: "OCT 2025",
    meta2: "TECH · REVIEW",
    image: "/images/image-1121789191016733.avif",
    description: "Exploring the transition from passwords to passkeys and biometric hardware tokens.",
  },
  {
    id: 2,
    title: "MASTERING GSAP",
    subtitle: "TUTORIAL",
    category: "DEVELOPMENT",
    meta1: "SEP 2025",
    meta2: "CODE · ANIMATION",
    image: "/images/image-1121793031016349.avif",
    description: "A deep dive into scroll-hijacking, pinned sections, and performant web animations.",
  },
  {
    id: 3,
    title: "ZERO KNOWLEDGE",
    subtitle: "CRYPTOGRAPHY",
    category: "DEEP DIVE",
    meta1: "AUG 2025",
    meta2: "MATH · PROTOCOLS",
    image: "/images/image-1121794107682908.avif",
    description: "How ZK-proofs are revolutionizing data privacy without compromising verification.",
  },
  {
    id: 4,
    title: "SOLID VS REACT",
    subtitle: "FRAMEWORKS",
    category: "OPINION",
    meta1: "JUL 2025",
    meta2: "JS · PERFORMANCE",
    image: "/images/image-1121794571016195.avif",
    description: "My personal journey migrating projects between React's VDOM and SolidJS's fine-grained reactivity.",
  },
  {
    id: 5,
    title: "STATE MACHINES",
    subtitle: "ARCHITECTURE",
    category: "SYSTEMS",
    meta1: "JUN 2025",
    meta2: "XSTATE · LOGIC",
    image: "/images/image-1121796031016049.avif",
    description: "Why you should be using finite state machines to govern your complex UI states.",
  },
  {
    id: 6,
    title: "EDGE COMPUTING",
    subtitle: "INFRASTRUCTURE",
    category: "CLOUD",
    meta1: "MAY 2025",
    meta2: "CDN · WORKERS",
    image: "/images/image-1121796551015997.avif",
    description: "Moving logic closer to the user: A guide to Cloudflare Workers and Edge rendering.",
  },
  {
    id: 7,
    title: "THE CRAFTSMAN",
    subtitle: "PHILOSOPHY",
    category: "PERSONAL",
    meta1: "APR 2025",
    meta2: "LIFE · TECH",
    image: "/images/image-1121793034349682.avif",
    description: "Reflections on treating software engineering as a digital craft rather than just writing code.",
  }
];

export function Blog() {
  return <Reel slides={blogSlides} />;
}
