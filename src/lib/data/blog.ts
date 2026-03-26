export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  author: string;
  readingMinutes: number;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    id: "B001",
    slug: "best-time-to-visit-indochina",
    title: "Best Time to Visit Indochina: Month-by-Month Guide",
    excerpt:
      "A practical seasonal breakdown for Vietnam, Laos, Cambodia, and Thailand to help you plan the perfect luxury itinerary.",
    coverImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "2026-02-12",
    author: "Linh Tran",
    readingMinutes: 8,
    content: [
      "Indochina offers year-round travel opportunities, but each destination has a unique seasonal rhythm. Understanding this lets you pair experiences with ideal weather windows.",
      "For northern Vietnam and Laos, October to March is generally comfortable and dry. Cambodia and southern Vietnam can be excellent from November through February.",
      "Shoulder seasons can be rewarding for travelers seeking fewer crowds, greener landscapes, and strong value from luxury properties.",
    ],
  },
  {
    id: "B002",
    slug: "luxury-river-cruises-in-vietnam-and-cambodia",
    title: "Luxury River Cruises in Vietnam and Cambodia",
    excerpt:
      "From Mekong artistry to refined onboard dining, discover how to choose the right river cruise style.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "2026-01-29",
    author: "Harper Nguyen",
    readingMinutes: 6,
    content: [
      "River cruising in Southeast Asia balances slow travel with premium comfort. It is ideal for travelers who value scenery, culture, and unpack-once convenience.",
      "Choose vessels based on cabin style, dining philosophy, and shore excursion depth. Curated small-group landings often create the most memorable moments.",
      "Pair your cruise with a city extension in Hanoi, Siem Reap, or Bangkok to add architecture, cuisine, and modern design scenes.",
    ],
  },
  {
    id: "B003",
    slug: "honeymoon-itinerary-vietnam-thailand",
    title: "A 10-Day Honeymoon Through Vietnam and Thailand",
    excerpt:
      "A romantic blend of heritage cities, tropical coastlines, and private dining designed for couples.",
    coverImage:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "2026-01-08",
    author: "Sophie Le",
    readingMinutes: 7,
    content: [
      "An ideal honeymoon combines contrast: cultural immersion first, then restorative beach time. Vietnam and Thailand offer this in a seamless regional journey.",
      "Start in Hanoi and Halong Bay for history and cinematic landscapes, then continue to Phuket for private villa stays and sunset cruises.",
      "Focus on fewer hotel changes, meaningful upgrades, and experiences that feel personal rather than packed.",
    ],
  },
  {
    id: "B004",
    slug: "family-friendly-luxury-travel-in-laos",
    title: "Family-Friendly Luxury Travel in Laos",
    excerpt:
      "How to design a premium Laos itinerary that keeps both kids and adults deeply engaged.",
    coverImage:
      "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "2025-12-18",
    author: "Minh Vo",
    readingMinutes: 5,
    content: [
      "Laos is ideal for families who want slow pacing, nature, and authentic cultural encounters. The atmosphere is calm, safe, and deeply welcoming.",
      "Choose properties with open green space, interconnecting rooms, and meaningful family activities like craft workshops or gentle cycling routes.",
      "Balance activity and downtime with no more than one major excursion per day for a smoother experience.",
    ],
  },
  {
    id: "B005",
    slug: "golf-travel-thailand-premium-courses",
    title: "Thailand Golf Travel: Premium Courses Worth the Trip",
    excerpt:
      "A look at championship courses, seasonality, and concierge-level add-ons for serious golf travelers.",
    coverImage:
      "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "2025-11-25",
    author: "David Pham",
    readingMinutes: 6,
    content: [
      "Thailand remains one of Asia's strongest luxury golf destinations thanks to course quality, service standards, and weather flexibility.",
      "Hua Hin and Phuket are standout bases, offering excellent fairways plus beach resorts and private transport logistics.",
      "A concierge-managed golf itinerary should include caddy coordination, post-round recovery options, and premium dining.",
    ],
  },
  {
    id: "B006",
    slug: "siem-reap-beyond-angkor",
    title: "Siem Reap Beyond Angkor: Design, Dining, and Local Craft",
    excerpt:
      "Siem Reap has evolved into a stylish destination with much more than temple visits.",
    coverImage:
      "https://images.unsplash.com/photo-1596534766419-6f8fe5f782c1?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "2025-11-04",
    author: "Anya Hoang",
    readingMinutes: 7,
    content: [
      "While Angkor remains iconic, Siem Reap's contemporary side is equally compelling. Boutique design studios and chef-led restaurants now define the city experience.",
      "Spend one day on temples, one on art and craft ateliers, and one on nearby villages and lake life for balance.",
      "The result is a richer understanding of Cambodia's creative present, not just its monumental past.",
    ],
  },
];
