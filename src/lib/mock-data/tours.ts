import { Tour } from "@/service/tour/type";

export const mockTours: Tour[] = [
    {
        id: "T001",
        slug: "hanoi-to-halong-bay-signature-cruise",
        title: "Hanoi to Halong Bay Signature Cruise",
        locale: "en",
        translationGroupId: "tg001",
        originId: null,

        destinationId: "D001",

        images: [
            "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1559599238-308793637427?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80",
        ],

        durationDays: 4,
        durationNights: 3,
        maxPeople: 12,

        price: 1450,
        salePrice: 1290,

        currency: "USD",

        description:
            "Sail through emerald limestone karsts and enjoy a curated blend of Hanoi heritage and premium overnight cruising.",

        itinerary: [
            { day: 1, title: "Arrival in Hanoi", content: "Private pickup, old quarter walk, and welcome dinner." },
            { day: 2, title: "Halong Bay Embarkation", content: "Transfer to the bay and board a luxury vessel for sunset cruising." },
            { day: 3, title: "Kayaking and Cave Discovery", content: "Morning tai chi, cave excursion, and seafood tasting menu." },
            { day: 4, title: "Return to Hanoi", content: "Brunch onboard and transfer to airport or city hotel." },
        ],

        tags: ["Best Seller", "Signature"],

        status: "published",

        seo: {
            title: "Hanoi to Halong Bay Signature Cruise | STOUR LUXE",
            description: "Experience luxury cruising through Halong Bay with STOUR LUXE",
            keywords: ["halong", "cruise", "hanoi", "vietnam", "luxury"],
        },

        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",

        defaultLocale: false,
        featured: true,
    },
    {
        id: "T002",
        slug: "mekong-river-slow-journey",
        title: "Mekong River Slow Journey",
        locale: "en",
        translationGroupId: "tg002",
        originId: null,

        destinationId: "D002",

        images: [
            "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80",
        ],

        durationDays: 5,
        durationNights: 4,
        maxPeople: 16,

        price: 1190,
        salePrice: 1020,

        currency: "USD",

        description:
            "Cruise through floating villages and fruit orchards with immersive local encounters and relaxed riverside stays.",

        itinerary: [
            { day: 1, title: "Ho Chi Minh City", content: "Design hotel check-in and rooftop welcome cocktail." },
            { day: 2, title: "Can Tho Markets", content: "Sunrise floating market tour and artisan workshop visit." },
            { day: 3, title: "Ben Tre Villages", content: "Cycling trails through coconut groves and craft villages." },
            { day: 4, title: "Riverside Leisure", content: "Wellness-focused day with spa and sunset cruise." },
            { day: 5, title: "Departure", content: "Transfer to airport with optional city extension." },
        ],

        tags: ["Relaxed Pace", "River Life"],

        status: "published",

        seo: {
            title: "Mekong River Slow Journey | STOUR LUXE",
            description: "Experience slow travel on the Mekong River",
            keywords: ["mekong", "river", "vietnam", "slow travel"],
        },

        createdAt: "2024-01-16T10:00:00Z",
        updatedAt: "2024-01-16T10:00:00Z",

        defaultLocale: false,
        featured: true,
    },
    {
        id: "T003",
        slug: "sapa-highland-retreat",
        title: "Sapa Highland Retreat",
        locale: "en",
        translationGroupId: "tg003",
        originId: null,

        destinationId: "D003",

        images: [
            "https://images.unsplash.com/photo-1566916118472-84ba6fa2dc78?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
        ],

        durationDays: 4,
        durationNights: 3,
        maxPeople: 10,

        price: 980,
        salePrice: null,

        currency: "USD",

        description:
            "A highland escape featuring terraced valleys, boutique lodges, and mindful trekking through ethnic villages.",

        itinerary: [
            { day: 1, title: "Arrival and Acclimatization", content: "Scenic transfer and evening at a mountain-view lodge." },
            { day: 2, title: "Village Trails", content: "Guided hike through Lao Chai and Ta Van with local lunch." },
            { day: 3, title: "Cable Car and Spa", content: "Fansipan panorama and restorative spa ritual." },
            { day: 4, title: "Return", content: "Breakfast with valley views and departure transfer." },
        ],

        tags: ["Mountain", "Nature"],

        status: "published",

        seo: {
            title: "Sapa Highland Retreat | STOUR LUXE",
            description: "Wellness retreat in Sapa highlands",
            keywords: ["sapa", "highlands", "vietnam", "trekking", "wellness"],
        },

        createdAt: "2024-01-17T10:00:00Z",
        updatedAt: "2024-01-17T10:00:00Z",

        defaultLocale: false,
        featured: false,
    },
    {
        id: "T004",
        slug: "luang-prabang-heritage-wellness",
        title: "Luang Prabang Heritage & Wellness",
        locale: "en",
        translationGroupId: "tg004",
        originId: null,

        destinationId: "D004",

        images: [
            "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1400&q=80",
        ],

        durationDays: 4,
        durationNights: 3,
        maxPeople: 14,

        price: 1100,
        salePrice: 940,

        currency: "USD",

        description:
            "Discover temple serenity, riverside sunsets, and holistic wellness moments in Laos' timeless cultural capital.",

        itinerary: [
            { day: 1, title: "Old Town Arrival", content: "Colonial quarter orientation and Mekong sunset." },
            { day: 2, title: "Temple Circuit", content: "Wat Xieng Thong visit and monk blessing ceremony." },
            { day: 3, title: "Kuang Si Falls", content: "Morning nature excursion and afternoon spa treatment." },
            { day: 4, title: "Departure", content: "Leisure breakfast and airport transfer." },
        ],

        tags: ["Culture", "Spa"],

        status: "published",

        seo: {
            title: "Luang Prabang Heritage & Wellness | STOUR LUXE",
            description: "Cultural and wellness experience in Luang Prabang",
            keywords: ["luang prabang", "laos", "culture", "wellness", "temples"],
        },

        createdAt: "2024-01-18T10:00:00Z",
        updatedAt: "2024-01-18T10:00:00Z",

        defaultLocale: false,
        featured: true,
    },
    {
        id: "T005",
        slug: "siem-reap-angkor-explorer",
        title: "Siem Reap Angkor Explorer",
        locale: "en",
        translationGroupId: "tg005",
        originId: null,

        destinationId: "D005",

        images: [
            "https://images.unsplash.com/photo-1551362185-acf68346add1?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
        ],

        durationDays: 5,
        durationNights: 4,
        maxPeople: 15,

        price: 1350,
        salePrice: 1150,

        currency: "USD",

        description:
            "Explore the magnificent temples of Angkor with expert guides and immersive cultural experiences.",

        itinerary: [
            { day: 1, title: "Siem Reap Welcome", content: "Arrival and boutique accommodation check-in." },
            { day: 2, title: "Angkor Wat Discovery", content: "Sunrise tour of the iconic temple complex." },
            { day: 3, title: "Bayon and Temples", content: "Guided exploration of ancient stone faces." },
            { day: 4, title: "Tonle Sap Lake", content: "Floating village and artisan workshop visit." },
            { day: 5, title: "Departure", content: "Final market tour and airport transfer." },
        ],

        tags: ["History", "Adventure"],

        status: "published",

        seo: {
            title: "Siem Reap Angkor Explorer | STOUR LUXE",
            description: "Explore ancient temples of Angkor with STOUR LUXE",
            keywords: ["angkor", "siem reap", "cambodia", "temples", "history"],
        },

        createdAt: "2024-01-19T10:00:00Z",
        updatedAt: "2024-01-19T10:00:00Z",

        defaultLocale: false,
        featured: true,
    },
];
