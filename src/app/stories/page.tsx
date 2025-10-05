"use client";

import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel1";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./stories.css";

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
    excerpt: `In this story, I will share how I transformed my passion for clay into a thriving business. From humble beginnings to showcasing my work in local galleries, it's been an incredible journey.`,
  },
  {
    id: "2",
    img: "/artist2.png",
    title: "Breathing Life Into Wood",
    artist: "MANG BEN",
    excerpt:
      "What began as a childhood pastime of carving fallen branches grew into my lifelong craft. Every curve and groove is a reflection of patience, culture, and the stories of my community. Through woodcarving, I honor the trees that once stood tall and turn them into timeless art.",
  },
  {
    id: "3",
    img: "/artist3.png",
    title: "Colors of Memory",
    artist: "CARLA",
    excerpt:
      "I started painting with leftover pigments from my father’s shop. To me, each brushstroke is not just art but memory — of sunsets in the province, of festivals, of people’s daily lives. Painting allows me to preserve emotions and share stories that words cannot always capture.",
  },
  {
    id: "4",
    img: "/artist4.png",
    title: "Threads of Tradition",
    artist: "DAVID",
    excerpt:
      "Handweaving was passed down to me by my grandmother. Every thread I weave is a prayer, every pattern a history book. Through weaving, I keep our heritage alive while creating pieces that can travel the world, carrying the spirit of our ancestors in every strand.",
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

export default function StoriesPage() {
  return (
    <>
      <Navbar />

      <div className="stories-page">
        <div className="stories-carousel">
          <ImageCarousel autoSlide={true} slideInterval={3000} />
          <div className="stories-carousel-text">
            <h1 className="stories-carousel-title">Stories of Olongapo</h1>
            <p className="stories-carousel-subtext">
              Discover the people, culture, and heritage behind every craft.
            </p>
          </div>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card">
              <img src={story.img} alt={story.title} className="story-img" />

              <h2 className="story-title">{story.title}</h2>
              <p className="story-artist">{story.artist}</p>
              <p className="story-excerpt">
                {story.excerpt.length > 200
                  ? story.excerpt.substring(0, 200) + "..."
                  : story.excerpt}
              </p>

              <Link href={`/artiststory/${story.id}`} className="read-more-btn">
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
