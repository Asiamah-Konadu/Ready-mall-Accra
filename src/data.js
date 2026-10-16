// Mock Database mirroring Supabase tables for Ready Mall Accra
// Multi-Merchant Square Stalls Architecture

export const DISTRICTS = [
  {
    id: "district-shoes",
    name: "👟 Shoe & Footwear District",
    key: "shoes",
    description: "Multi-merchant plaza dedicated to sneakers, luxury heels, retro kicks & slides"
  },
  {
    id: "district-tech",
    name: "📱 Tech & Electronics Alley",
    key: "tech",
    description: "Apple devices, original powerbanks, earbuds & phone accessories"
  },
  {
    id: "district-groceries",
    name: "🛒 Groceries & Market Bazaar",
    key: "groceries",
    description: "Kingsbite chocolate, plantain chips, pantry essentials & fresh fruit"
  },
  {
    id: "district-food",
    name: "🍔 Food Court & Dining",
    key: "food",
    description: "Authentic Ghana Jollof, spicy wings, pizza, and chilled sobolo"
  }
];

export const STORES = [
  // --- SHOE & FOOTWEAR DISTRICT (4 MULTI-MERCHANT STALLS) ---
  {
    id: "store-shoes-1",
    name: "Kwame's Kicks",
    slug: "kwames-kicks",
    districtId: "district-shoes",
    zone: "shoes",
    stallNumber: "Stall S1",
    category: "shoes",
    themeColor: 0xef4444, // Vibrant Red / Chicago
    hexColor: "#ef4444",
    owner: "Kwame Mensah",
    whatsapp: "+233244123456",
    icon: "👟",
    tagline: "High-heat Jordan 1s, Dunks & Streetwear Grails"
  },
  {
    id: "store-shoes-2",
    name: "Abena Luxury Footwear",
    slug: "abena-luxury",
    districtId: "district-shoes",
    zone: "shoes",
    stallNumber: "Stall S2",
    category: "shoes",
    themeColor: 0xec4899, // Fuchsia pink / Glamour
    hexColor: "#ec4899",
    owner: "Abena Mansa",
    whatsapp: "+233552345678",
    icon: "👠",
    tagline: "Designer stilettos, classic loafers & party heels"
  },
  {
    id: "store-shoes-3",
    name: "Osu Thrift & Retro Kicks",
    slug: "osu-retro",
    districtId: "district-shoes",
    zone: "shoes",
    stallNumber: "Stall S3",
    category: "shoes",
    themeColor: 0x06b6d4, // Cyan / Vintage
    hexColor: "#06b6d4",
    owner: "Kobi 'Sneakerhead' Baah",
    whatsapp: "+233201998877",
    icon: "👟",
    tagline: "Vintage New Balance 550s, Samba Classics & retro gems"
  },
  {
    id: "store-shoes-4",
    name: "Accra Slide City & Care",
    slug: "slide-city",
    districtId: "district-shoes",
    zone: "shoes",
    stallNumber: "Stall S4",
    category: "shoes",
    themeColor: 0xf59e0b, // Amber Gold
    hexColor: "#f59e0b",
    owner: "Nana Yaw",
    whatsapp: "+233277665544",
    icon: "🩴",
    tagline: "Yeezy slides, leather sandals & sneaker protection kits"
  },

  // --- TECH & ELECTRONICS DISTRICT ---
  {
    id: "store-tech-1",
    name: "Kojo Tech Hub",
    slug: "kojo-tech",
    districtId: "district-tech",
    zone: "tech",
    stallNumber: "Stall E1",
    category: "electronics",
    themeColor: 0x3b82f6, // Royal Blue
    hexColor: "#3b82f6",
    owner: "Kojo Asante",
    whatsapp: "+233555987654",
    icon: "📱",
    tagline: "AirPods Pro, MacBooks & genuine Apple accessories"
  },
  {
    id: "store-tech-2",
    name: "Accra Gadget World",
    slug: "accra-gadgets",
    districtId: "district-tech",
    zone: "tech",
    stallNumber: "Stall E2",
    category: "electronics",
    themeColor: 0x8b5cf6, // Purple
    hexColor: "#8b5cf6",
    owner: "Samuel Osei",
    whatsapp: "+233240112233",
    icon: "🔋",
    tagline: "Anker powerbanks, Oraimo FreePods & fast chargers"
  },

  // --- GROCERIES & MARKET BAZAAR ---
  {
    id: "store-groc-1",
    name: "Osu Fresh Mart",
    slug: "osu-fresh",
    districtId: "district-groceries",
    zone: "groceries",
    stallNumber: "Stall G1",
    category: "groceries",
    themeColor: 0x10b981, // Emerald Green
    hexColor: "#10b981",
    owner: "Auntie Akosua",
    whatsapp: "+233200778899",
    icon: "🛒",
    tagline: "Kingsbite chocolate, spiced plantain chips & Milo"
  },

  // --- FOOD COURT ---
  {
    id: "store-food-1",
    name: "Chorkor Chop Bar & Pizza",
    slug: "chorkor-food",
    districtId: "district-food",
    zone: "food",
    stallNumber: "Stall F1",
    category: "food",
    themeColor: 0xf97316, // Orange
    hexColor: "#f97316",
    owner: "Chef Esi",
    whatsapp: "+233544332211",
    icon: "🍔",
    tagline: "Smoky Ghana Jollof, cheesy pizza & chilled sobolo"
  }
];

export const PRODUCTS = [
  // === STALL S1: KWAME'S KICKS ===
  {
    id: "prod-kwame-1",
    storeId: "store-shoes-1",
    name: "Nike Air Jordan 1 High OG (Chicago)",
    price: 480,
    stock: 7,
    category: "shoes",
    shelfId: "shelf-s1-1",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80",
    description: "Classic high-top silhouette in iconic Chicago red, black, and white colourway. Premium leather finish.",
    boxColor: 0xef4444,
    variants: ["EU 41", "EU 42", "EU 43", "EU 44", "EU 45"]
  },
  {
    id: "prod-kwame-2",
    storeId: "store-shoes-1",
    name: "Nike Dunk Low Retro 'Panda'",
    price: 390,
    stock: 9,
    category: "shoes",
    shelfId: "shelf-s1-2",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80",
    description: "The street everyday staple in crisp black and white leather. Padded low-cut collar for ultimate ease.",
    boxColor: 0x111827,
    variants: ["EU 40", "EU 42", "EU 43", "EU 44"]
  },

  // === STALL S2: ABENA LUXURY FOOTWEAR ===
  {
    id: "prod-abena-1",
    storeId: "store-shoes-2",
    name: "Scarlet Stiletto Red-Sole Pumps",
    price: 520,
    stock: 5,
    category: "shoes",
    shelfId: "shelf-s2-1",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80",
    description: "100mm patent leather pumps with lacquered sole. Designed for gala nights and red carpets in East Legon.",
    boxColor: 0xec4899,
    variants: ["EU 37", "EU 38", "EU 39", "EU 40"]
  },
  {
    id: "prod-abena-2",
    storeId: "store-shoes-2",
    name: "Italian Tassel Leather Loafers",
    price: 450,
    stock: 6,
    category: "shoes",
    shelfId: "shelf-s2-2",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&auto=format&fit=crop&q=80",
    description: "Handcrafted calfskin leather with polished gold buckle tassel. Supreme comfort for corporate & wedding wear.",
    boxColor: 0x78350f,
    variants: ["EU 41", "EU 42", "EU 43", "EU 44"]
  },

  // === STALL S3: OSU VINTAGE & RETRO KICKS ===
  {
    id: "prod-osu-1",
    storeId: "store-shoes-3",
    name: "New Balance 550 White/Forest Green",
    price: 420,
    stock: 8,
    category: "shoes",
    shelfId: "shelf-s3-1",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=80",
    description: "Clean retro 80s court basketball shoe with premium suede toe cap and forest green accents.",
    boxColor: 0x10b981,
    variants: ["EU 41", "EU 42", "EU 43"]
  },
  {
    id: "prod-osu-2",
    storeId: "store-shoes-3",
    name: "Adidas Samba Classic White/Black Gum",
    price: 380,
    stock: 11,
    category: "shoes",
    shelfId: "shelf-s3-2",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80",
    description: "Full grain leather upper with light suede overlays and the iconic non-marking gum rubber sole.",
    boxColor: 0x06b6d4,
    variants: ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44"]
  },

  // === STALL S4: SLIDE CITY & CARE ===
  {
    id: "prod-slide-1",
    storeId: "store-shoes-4",
    name: "Comfort Bone Foam Slides",
    price: 190,
    stock: 15,
    category: "shoes",
    shelfId: "shelf-s4-1",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&auto=format&fit=crop&q=80",
    description: "Injected EVA foam that molds to your feet for lightweight durability. Strategic groove traction for Accra rain.",
    boxColor: 0xf59e0b,
    variants: ["EU 40-41", "EU 42-43", "EU 44-45"]
  },
  {
    id: "prod-slide-2",
    storeId: "store-shoes-4",
    name: "Premium Sneaker Cleaning Kit + Crease Guards",
    price: 110,
    stock: 22,
    category: "shoes",
    shelfId: "shelf-s4-2",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80",
    description: "Natural cleaning solution (200ml), premium horsehair brush, microfiber cloth, and 2 pairs of anti-crease guards.",
    boxColor: 0x64748b,
    variants: ["Full Kit"]
  },

  // === STALL E1: KOJO TECH HUB ===
  {
    id: "prod-tech-1",
    storeId: "store-tech-1",
    name: "Apple AirPods Pro (2nd Gen)",
    price: 1850,
    stock: 4,
    category: "electronics",
    shelfId: "shelf-e1-1",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80",
    description: "Active Noise Cancellation, Adaptive Transparency, and personalized Spatial Audio with MagSafe Case.",
    boxColor: 0xffffff,
    variants: ["Standard MagSafe USB-C"]
  },

  // === STALL E2: ACCRA GADGET WORLD ===
  {
    id: "prod-tech-2",
    storeId: "store-tech-2",
    name: "Anker 20,000mAh PowerCore 65W",
    price: 360,
    stock: 14,
    category: "electronics",
    shelfId: "shelf-e2-1",
    image: "https://images.unsplash.com/photo-1609592807784-a15e61df3f6f?w=500&auto=format&fit=crop&q=80",
    description: "Fast-charge your phone up to 4 times and powers USB-C laptops. Essential for Accra power shifts.",
    boxColor: 0x3b82f6,
    variants: ["Black Slate", "Midnight Blue"]
  },

  // === STALL G1: OSU FRESH MART ===
  {
    id: "prod-groc-1",
    storeId: "store-groc-1",
    name: "Golden Tree Kingsbite Chocolate Box (10x)",
    price: 95,
    stock: 25,
    category: "groceries",
    shelfId: "shelf-g1-1",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80",
    description: "Pure Ghana cocoa pride. Melt-resistant, rich chocolate formulated for the tropical West African climate.",
    boxColor: 0xd97706,
    variants: ["Full Box (10 bars)"]
  },

  // === STALL F1: CHORKOR CHOP BAR ===
  {
    id: "prod-food-1",
    storeId: "store-food-1",
    name: "Accra Smoked Jollof + Grilled Tilapia",
    price: 85,
    stock: 20,
    category: "food",
    shelfId: "shelf-f1-1",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=80",
    description: "Party-style firewood scented Jollof rice served with fresh spicy grilled tilapia, green pepper sauce, and kelewele.",
    boxColor: 0xf97316,
    variants: ["Medium Spice", "Accra Fire Hot"]
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9481",
    customerName: "Kofi Owusu",
    phone: "024 456 7890",
    address: "East Legon, near American House",
    storeId: "store-shoes-1",
    storeName: "Kwame's Kicks (Stall S1)",
    items: [
      { name: "Nike Air Jordan 1 High OG (Chicago)", qty: 1, price: 480 }
    ],
    total: 480,
    status: "paid",
    fulfillment: "preparing",
    network: "MTN MoMo",
    reference: "PAY-GH-77821",
    time: "10 mins ago"
  },
  {
    id: "ORD-9482",
    customerName: "Ama Serwaa",
    phone: "055 890 1234",
    address: "Airport Residential, Roman Ridge",
    storeId: "store-shoes-2",
    storeName: "Abena Luxury Footwear (Stall S2)",
    items: [
      { name: "Scarlet Stiletto Red-Sole Pumps", qty: 1, price: 520 }
    ],
    total: 520,
    status: "paid",
    fulfillment: "dispatched",
    network: "Telecel Cash",
    reference: "PAY-GH-77822",
    time: "25 mins ago"
  }
];
