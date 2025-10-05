"use client";

import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./artiststory.css";

interface Story {
  id: string;
  img: string;
  title: string;
  artist: string;
  excerpt: string;
}

const stories: Story[] = [
  {
    id: "1",
    img: "/artist1.jpg",
    title: "How I Turned Clay Into My Dream Business",
    artist: "RICHEL MARABE",
    excerpt: `In this story, I will share how I transformed my passion for clay into a thriving business. From humble beginnings to showcasing my work in local galleries, it's been an incredible journey.

"There are no happier people on this planet than those who decide that they want something, define what they want, get hold of the feeling of it even before its manifestation, and then joyously watch the unfolding as, piece by piece, it begins to unfold. That’s the feeling of your hands in the clay." – Esther Hicks

I had one transformative moment that completely changed my life. In the midst of the pandemic, while I was on pregnancy bed rest, Facebook became my favorite hangout. One day, I came across a cute miniature food keychain that sparked my curiosity and led me to browse how such miniature clay items were made.

After regaining some strength, I finally looked at the polymer clay set that had been sitting in my cart for several days. I decided to buy it, and that was the beginning of my journey with air-dry and polymer clay art. With determination, growing skills, and a little courage, I reached out for government support and officially started my business.

Since then, I’ve been blessed to be part of various programs of the Department of Trade and Industry (DTI) Zambales. One of my first exposures was the Women’s Month Trade Fair at SM Downtown Olongapo City back in March 2021. Because of the potential of my products, I was invited to join the Kapatid Mentor Me – Money Market Encounter (KMME-MME) Program in March 2022, where I graduated and was even recognized as one of the top 10 high scorers. Later, I was also invited to the “Juana Make a Mark” trademark registration incentive program by the Intellectual Property Office of the Philippines (IPOPHL).

I also had the opportunity to be enrolled in the One Town, One Product (OTOP) Next Generation program, where I attended a one-on-one consultation to improve my product labels and packaging. This partnership with DTI-Zambales elevated my business to new heights. Working with a government agency opened doors to trade fairs, free training, and professional assistance, which gave me and my business a mark of legitimacy. Customers saw that Gawang Kamay Olongapo Arts and Crafts was supported by DTI, and this made them more confident to transact with us. As a result, our sales increased by 60%—far more than I expected when I first started.

At Gawang Kamay Olongapo Arts and Crafts, we specialize in capturing life’s important moments through 3D clay art. Our most popular creations are Chibi miniatures, and I’ve had the honor of crafting figures for famous artists and even politicians. One highlight for me was when we were featured on the TV show Swak na Swak with Mr. Bobby Yan on June 5, 2021. As competition grew tougher, I expanded our product line to include keychains, earrings, and small standees with voice recordings.

The birth of Gawang Kamay Olongapo Arts and Crafts is a story of life’s challenges turning into opportunities. And if there’s one thing I’ve learned and always share, it’s this: “Don’t be afraid to start over—it gives you a chance to build something better.”`,
  },
  {
    id: "2",
    img: "/artist2.png",
    title: "Breathing Life Into Wood",
    artist: "MANG BEN",
    excerpt:
      "What began as a simple childhood pastime—gathering fallen branches and carving them into small shapes and figures—slowly grew into a lifelong passion and craft. Each curve, notch, and groove I carve into the wood carries more than just form; it holds patience, intention, and the deep-rooted stories of my community. With every stroke, I remember the hands that came before me, the traditions passed down through generations, and the cultural heritage that shapes my identity. Through woodcarving, I strive not only to honor the trees that once stood tall and proud but also to transform them into pieces of art that tell a story, evoke emotion, and preserve a legacy for those who come after. It is in this process that the ordinary becomes extraordinary, and the silent whispers of the forest are given voice through my hands and imagination.",
  },
  {
    id: "3",
    img: "/artist3.png",
    title: "Colors of Memory",
    artist: "CARLA",
    excerpt:
      "What inspired me to create this piece was the vibrant tapestry of memories that colors our lives. Each hue represents a different emotion, a fleeting moment, or a cherished experience. As I worked on this artwork, I reflected on the people and places that have shaped my journey. The bold strokes convey the passion I feel for my craft, while the softer shades evoke a sense of nostalgia. Through this piece, I hope to invite viewers to explore their own memories and find beauty in the complexities of life.",
  },
  {
    id: "4",
    img: "/artist4.png",
    title: "Threads of Tradition",
    artist: "DAVID",
    excerpt:
      "What drives my work is the intricate tapestry of traditions that bind us. Each thread in this piece represents a story, a lesson, or a memory passed down through generations. As I wove these elements together, I reflected on the rich cultural heritage that shapes our identities. The bold patterns speak to the strength of our roots, while the subtle nuances invite contemplation and connection. Through this artwork, I aim to honor the past while inspiring future generations to carry these stories forward.",
  },
  {
    id: "5",
    img: "/artist5.png",
    title: "Story of My Journey",
    artist: "EBON",
    excerpt:
      "What inspired me to create this piece was the vibrant tapestry of memories that colors our lives. Each hue represents a different emotion, a fleeting moment, or a cherished experience. As I worked on this artwork, I reflected on the people and places that have shaped my journey. The bold strokes convey the passion I feel for my craft, while the softer shades evoke a sense of nostalgia. Through this piece, I hope to invite viewers to explore their own memories and find beauty in the complexities of life.",
  },
  {
    id: "6",
    img: "/artist6.png",
    title: "Art of Resilience",
    artist: "FRANCES",
    excerpt:
      "What inspired me to create this piece was the idea of resilience in the face of adversity. Each layer of paint represents a struggle, a triumph, or a moment of reflection. As I worked on this artwork, I thought about the challenges I've faced and the strength I've found within myself. The bold colors convey the intensity of my emotions, while the softer tones remind me of the moments of peace I've discovered along the way. Through this piece, I hope to inspire others to embrace their own journeys and find beauty in the process of healing.",
  },
];

export default function ArtistStoryPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();

  const story = stories.find((s) => s.id === id);

  if (!story) {
    return (
      <>
        <Navbar />
        <div className="artiststory-page">
          <h1>Artist Story Not Available.</h1>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="artiststory-page">
        <div className="artiststory-box">
          <button className="story-back-button" onClick={() => router.back()}>
            ←
          </button>

          <img src={story.img} alt={story.title} className="artiststory-img" />
          <h1 className="artiststory-title">{story.title}</h1>
          <h2 className="artiststory-artist">By {story.artist}</h2>
          <p className="artiststory-excerpt">{story.excerpt}</p>
          <button
            className="artiststory-btn"
            onClick={() => router.push(`/marketplace?artist=${story.artist}`)}
          >
            Visit Store
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
