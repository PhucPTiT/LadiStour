export type Tour = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  typologies: string[];
  durationDays: number;
  durationNights: number;
  price: number;
  salePrice?: number;
  images: string[];
  description: string;
  itinerary: { day: number; title: string; content: string }[];
  inclusions: string[];
  exclusions: string[];
  tags: string[];
};

const defaultInclusions = [
  "Boutique accommodation with daily breakfast",
  "Private airport transfers",
  "English-speaking local guides",
  "Curated cultural and culinary experiences",
];

const defaultExclusions = [
  "International flights",
  "Personal expenses and gratuities",
  "Travel insurance",
  "Visa fees if applicable",
];

export const tours: Tour[] = [
  {
    id: "T001",
    slug: "hanoi-to-halong-bay-signature-cruise",
    title: "Hanoi to Halong Bay Signature Cruise",
    destination: "Halong Bay",
    country: "Vietnam",
    typologies: ["Luxury", "Family"],
    durationDays: 4,
    durationNights: 3,
    price: 1450,
    salePrice: 1290,
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1559599238-308793637427?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "Sail through emerald limestone karsts and enjoy a curated blend of Hanoi heritage and premium overnight cruising.",
    itinerary: [
      { day: 1, title: "Arrival in Hanoi", content: "Private pickup, old quarter walk, and welcome dinner." },
      { day: 2, title: "Halong Bay Embarkation", content: "Transfer to the bay and board a luxury vessel for sunset cruising." },
      { day: 3, title: "Kayaking and Cave Discovery", content: "Morning tai chi, cave excursion, and seafood tasting menu." },
      { day: 4, title: "Return to Hanoi", content: "Brunch onboard and transfer to airport or city hotel." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Best Seller", "Signature"],
  },
  {
    id: "T002",
    slug: "mekong-river-slow-journey",
    title: "Mekong River Slow Journey",
    destination: "Mekong Delta",
    country: "Vietnam",
    typologies: ["Wellness", "Family"],
    durationDays: 5,
    durationNights: 4,
    price: 1190,
    salePrice: 1020,
    images: [
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "Cruise through floating villages and fruit orchards with immersive local encounters and relaxed riverside stays.",
    itinerary: [
      { day: 1, title: "Ho Chi Minh City", content: "Design hotel check-in and rooftop welcome cocktail." },
      { day: 2, title: "Can Tho Markets", content: "Sunrise floating market tour and artisan workshop visit." },
      { day: 3, title: "Ben Tre Villages", content: "Cycling trails through coconut groves and craft villages." },
      { day: 4, title: "Riverside Leisure", content: "Wellness-focused day with spa and sunset cruise." },
      { day: 5, title: "Departure", content: "Transfer to airport with optional city extension." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Relaxed Pace", "River Life"],
  },
  {
    id: "T003",
    slug: "sapa-highland-retreat",
    title: "Sapa Highland Retreat",
    destination: "Sapa",
    country: "Vietnam",
    typologies: ["Wellness", "Luxury"],
    durationDays: 4,
    durationNights: 3,
    price: 980,
    images: [
      "https://images.unsplash.com/photo-1566916118472-84ba6fa2dc78?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "A highland escape featuring terraced valleys, boutique lodges, and mindful trekking through ethnic villages.",
    itinerary: [
      { day: 1, title: "Arrival and Acclimatization", content: "Scenic transfer and evening at a mountain-view lodge." },
      { day: 2, title: "Village Trails", content: "Guided hike through Lao Chai and Ta Van with local lunch." },
      { day: 3, title: "Cable Car and Spa", content: "Fansipan panorama and restorative spa ritual." },
      { day: 4, title: "Return", content: "Breakfast with valley views and departure transfer." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Mountain", "Nature"],
  },
  {
    id: "T004",
    slug: "luang-prabang-heritage-wellness",
    title: "Luang Prabang Heritage & Wellness",
    destination: "Luang Prabang",
    country: "Laos",
    typologies: ["Wellness", "Honeymoon"],
    durationDays: 4,
    durationNights: 3,
    price: 1100,
    salePrice: 940,
    images: [
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "Discover temple serenity, riverside sunsets, and holistic wellness moments in Laos' timeless cultural capital.",
    itinerary: [
      { day: 1, title: "Old Town Arrival", content: "Colonial quarter orientation and Mekong sunset." },
      { day: 2, title: "Temple Circuit", content: "Wat Xieng Thong visit and monk blessing ceremony." },
      { day: 3, title: "Kuang Si Falls", content: "Morning nature excursion and afternoon spa treatment." },
      { day: 4, title: "Departure", content: "Leisure breakfast and airport transfer." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Culture", "Spa"],
  },
  {
    id: "T005",
    slug: "vientiane-and-vang-vieng-escape",
    title: "Vientiane & Vang Vieng Escape",
    destination: "Vang Vieng",
    country: "Laos",
    typologies: ["Family", "Adventure"],
    durationDays: 5,
    durationNights: 4,
    price: 1260,
    images: [
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "Blend laid-back city culture with dramatic limestone landscapes and river adventures.",
    itinerary: [
      { day: 1, title: "Vientiane Highlights", content: "Patuxai monument and sunset by the Mekong promenade." },
      { day: 2, title: "Train to Vang Vieng", content: "Scenic transfer and resort check-in." },
      { day: 3, title: "River and Caves", content: "Kayaking and guided cave exploration." },
      { day: 4, title: "Leisure Day", content: "Optional cycling tour or poolside wellness." },
      { day: 5, title: "Departure", content: "Return transfer and onward travel." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Active", "Scenic"],
  },
  {
    id: "T006",
    slug: "siem-reap-angkor-elite",
    title: "Siem Reap Angkor Elite",
    destination: "Siem Reap",
    country: "Cambodia",
    typologies: ["Luxury", "Honeymoon"],
    durationDays: 4,
    durationNights: 3,
    price: 1580,
    salePrice: 1390,
    images: [
      "https://images.unsplash.com/photo-1596534766419-6f8fe5f782c1?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1583055827258-95f8db39f44f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "Exclusive Angkor sunrise access, private temple guidance, and a refined boutique stay in Siem Reap.",
    itinerary: [
      { day: 1, title: "Arrival in Siem Reap", content: "Check-in and evening Khmer tasting menu." },
      { day: 2, title: "Angkor Sunrise", content: "Early temple tour with personalized photography stops." },
      { day: 3, title: "Art and Craft", content: "Cambodian design studios and Tonle Sap sunset cruise." },
      { day: 4, title: "Departure", content: "Farewell brunch and transfer." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Temple", "Premium"],
  },
  {
    id: "T007",
    slug: "phnom-penh-cultural-weekend",
    title: "Phnom Penh Cultural Weekend",
    destination: "Phnom Penh",
    country: "Cambodia",
    typologies: ["Family", "City"],
    durationDays: 3,
    durationNights: 2,
    price: 760,
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "A short and curated city experience focused on Khmer heritage, architecture, and contemporary dining.",
    itinerary: [
      { day: 1, title: "Royal Quarter", content: "Palace visit and riverside evening cruise." },
      { day: 2, title: "Museums and Markets", content: "Guided insights and culinary street tour." },
      { day: 3, title: "Departure", content: "Leisure breakfast and checkout." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["City Break", "Culture"],
  },
  {
    id: "T008",
    slug: "koh-rong-island-luxury-break",
    title: "Koh Rong Island Luxury Break",
    destination: "Koh Rong",
    country: "Cambodia",
    typologies: ["Honeymoon", "Luxury"],
    durationDays: 5,
    durationNights: 4,
    price: 1740,
    salePrice: 1520,
    images: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "A beachfront retreat with private villas, marine adventures, and elevated tropical dining.",
    itinerary: [
      { day: 1, title: "Island Arrival", content: "Fast boat transfer and beachfront sunset." },
      { day: 2, title: "Marine Discovery", content: "Snorkeling excursion and chef-led seafood lunch." },
      { day: 3, title: "Wellness Day", content: "Yoga session and spa treatment." },
      { day: 4, title: "Leisure", content: "Optional paddleboarding and private beach dinner." },
      { day: 5, title: "Return", content: "Departure ferry and airport transfer." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Beach", "Romance"],
  },
  {
    id: "T009",
    slug: "bangkok-design-and-dining",
    title: "Bangkok Design & Dining",
    destination: "Bangkok",
    country: "Thailand",
    typologies: ["Luxury", "City"],
    durationDays: 4,
    durationNights: 3,
    price: 1320,
    images: [
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "An urban escape built around architecture, Michelin-inspired tastings, and hidden canal neighborhoods.",
    itinerary: [
      { day: 1, title: "Riverside Check-in", content: "Private transfer and skyline dinner cruise." },
      { day: 2, title: "Historic Bangkok", content: "Grand Palace and artisan district exploration." },
      { day: 3, title: "Modern Bangkok", content: "Design galleries, rooftop bars, and tasting menus." },
      { day: 4, title: "Departure", content: "Relaxed morning and airport transfer." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["City", "Food"],
  },
  {
    id: "T010",
    slug: "chiang-mai-wellness-valley",
    title: "Chiang Mai Wellness Valley",
    destination: "Chiang Mai",
    country: "Thailand",
    typologies: ["Wellness", "Family"],
    durationDays: 5,
    durationNights: 4,
    price: 1210,
    salePrice: 1060,
    images: [
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "Experience northern Thai calm with gentle adventure, mindful rituals, and mountain hospitality.",
    itinerary: [
      { day: 1, title: "Arrival", content: "Settle in at a serene garden retreat." },
      { day: 2, title: "Temple and Tea", content: "Morning temple circuit and tea plantation visit." },
      { day: 3, title: "Nature Trails", content: "Guided hike and countryside lunch." },
      { day: 4, title: "Wellness Program", content: "Yoga, herbal steam, and evening sound bath." },
      { day: 5, title: "Departure", content: "Transfer and onward travel." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Mindful", "North Thailand"],
  },
  {
    id: "T011",
    slug: "phuket-luxury-coastline",
    title: "Phuket Luxury Coastline",
    destination: "Phuket",
    country: "Thailand",
    typologies: ["Honeymoon", "Luxury"],
    durationDays: 4,
    durationNights: 3,
    price: 1690,
    images: [
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "Private longtail experiences, hidden coves, and sunset dining along Thailand's iconic Andaman coast.",
    itinerary: [
      { day: 1, title: "Arrival", content: "VIP airport reception and villa check-in." },
      { day: 2, title: "Island Hopping", content: "Private speedboat and curated snorkeling route." },
      { day: 3, title: "Leisure and Spa", content: "Slow morning, spa ritual, and cliffside dinner." },
      { day: 4, title: "Departure", content: "Late checkout and transfer." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Beach", "Private"],
  },
  {
    id: "T012",
    slug: "gulf-of-thailand-golf-week",
    title: "Gulf of Thailand Golf Week",
    destination: "Hua Hin",
    country: "Thailand",
    typologies: ["Golf", "Luxury"],
    durationDays: 6,
    durationNights: 5,
    price: 1980,
    salePrice: 1760,
    images: [
      "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1400&q=80",
    ],
    description:
      "Premium fairways, ocean-view resorts, and tailored concierge support for discerning golf travelers.",
    itinerary: [
      { day: 1, title: "Arrival and Club Fitting", content: "Resort check-in and evening orientation." },
      { day: 2, title: "Championship Round 1", content: "Morning tee time at Black Mountain." },
      { day: 3, title: "Recovery and Beach", content: "Sports massage and free afternoon." },
      { day: 4, title: "Championship Round 2", content: "Second course with private caddy service." },
      { day: 5, title: "Leisure and Farewell", content: "Local excursions and sunset dinner." },
      { day: 6, title: "Departure", content: "Transfer to Bangkok airport." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    tags: ["Golf", "Premium"],
  },
];

export const destinations = Array.from(new Set(tours.map((tour) => tour.country))).sort();
export const typologies = Array.from(
  new Set(tours.flatMap((tour) => tour.typologies))
).sort();
