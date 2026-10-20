// ============================================================
//  Ready Mall Accra — Real Ghanaian Multi-Merchant Database
//  20 Authentic Vendors across 5 Districts with Real Products
// ============================================================

export const DISTRICTS = [
  {
    id: "district-shoes",
    name: "👟 Shoe & Footwear District",
    key: "shoes",
    description: "Multi-merchant plaza for sneakers, heels, retro classics & streetwear slides"
  },
  {
    id: "district-tech",
    name: "📱 Tech & Electronics Alley",
    key: "tech",
    description: "Apple devices, powerbanks, mechanical keyboards & audio accessories"
  },
  {
    id: "district-groceries",
    name: "🛒 Groceries & Market Bazaar",
    key: "groceries",
    description: "Kingsbite chocolate, black pepper shito, Volta gari & pure forest honey"
  },
  {
    id: "district-food",
    name: "🍔 Food Court & Dining",
    key: "food",
    description: "Ghana Party Jollof, Banku & Tilapia, Fufu & Light Soup, and fresh Sobolo"
  },
  {
    id: "district-fashion",
    name: "👗 Fashion, Beauty & Lifestyle Arcade",
    key: "fashion",
    description: "Bonwire Kente, Accra streetwear, pure Tamale shea butter & Arabian oud"
  }
];

export const STORES = [
  // ============================================================
  //  1. SHOE & FOOTWEAR DISTRICT (4 VENDORS)
  // ============================================================
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
    themeColor: 0xec4899, // Fuchsia Pink
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
    themeColor: 0x06b6d4, // Cyan
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

  // ============================================================
  //  2. TECH & ELECTRONICS DISTRICT (4 VENDORS)
  // ============================================================
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
  {
    id: "store-tech-3",
    name: "iStore Osu Specialist",
    slug: "istore-osu",
    districtId: "district-tech",
    zone: "tech",
    stallNumber: "Stall E3",
    category: "electronics",
    themeColor: 0x0284c7, // Sky Blue
    hexColor: "#0284c7",
    owner: "Paa Kwesi Arthur",
    whatsapp: "+233243556677",
    icon: "🍎",
    tagline: "MagSafe cases, Apple Watch bands & certified fast cables"
  },
  {
    id: "store-tech-4",
    name: "CompuGhana Circle",
    slug: "compughana-circle",
    districtId: "district-tech",
    zone: "tech",
    stallNumber: "Stall E4",
    category: "electronics",
    themeColor: 0x6366f1, // Indigo
    hexColor: "#6366f1",
    owner: "Derrick Lamptey",
    whatsapp: "+233544778899",
    icon: "💻",
    tagline: "Mechanical gaming keyboards, Logitech mice & USB-C docks"
  },

  // ============================================================
  //  3. GROCERIES & MARKET BAZAAR (4 VENDORS)
  // ============================================================
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
  {
    id: "store-groc-2",
    name: "Makola Spice & Organic Grains",
    slug: "makola-spices",
    districtId: "district-groceries",
    zone: "groceries",
    stallNumber: "Stall G2",
    category: "groceries",
    themeColor: 0xd97706, // Golden Ochre
    hexColor: "#d97706",
    owner: "Hajia Fati",
    whatsapp: "+233246332211",
    icon: "🌶️",
    tagline: "Aromatic Ghana Shito, dawadawa, white gari & local rice"
  },
  {
    id: "store-groc-3",
    name: "Danpong Wellness & Pantry",
    slug: "danpong-wellness",
    districtId: "district-groceries",
    zone: "groceries",
    stallNumber: "Stall G3",
    category: "groceries",
    themeColor: 0x059669, // Forest Green
    hexColor: "#059669",
    owner: "Dr. Danpong Mensah",
    whatsapp: "+233501223344",
    icon: "🍯",
    tagline: "Pure forest honey, organic moringa & baobab powders"
  },
  {
    id: "store-groc-4",
    name: "Golden Tree Sweet Emporium",
    slug: "golden-tree-shop",
    districtId: "district-groceries",
    zone: "groceries",
    stallNumber: "Stall G4",
    category: "groceries",
    themeColor: 0xb45309, // Chocolate Brown
    hexColor: "#b45309",
    owner: "Esi Sutherland",
    whatsapp: "+233271889900",
    icon: "🍫",
    tagline: "Pebbles, Tetteh Quarshie Dark Bars & cocoa butter treats"
  },

  // ============================================================
  //  4. FOOD COURT & DINING (4 VENDORS)
  // ============================================================
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
  },
  {
    id: "store-food-2",
    name: "Asanka Local Chop House",
    slug: "asanka-chop-house",
    districtId: "district-food",
    zone: "food",
    stallNumber: "Stall F2",
    category: "food",
    themeColor: 0xe11d48, // Crimson
    hexColor: "#e11d48",
    owner: "Maame Serwaa",
    whatsapp: "+233208554433",
    icon: "🍲",
    tagline: "Hot Fufu with Light Soup, goat meat & fresh Ga kenkey"
  },
  {
    id: "store-food-3",
    name: "Buka Restaurant Express",
    slug: "buka-express",
    districtId: "district-food",
    zone: "food",
    stallNumber: "Stall F3",
    category: "food",
    themeColor: 0xca8a04, // Deep Gold
    hexColor: "#ca8a04",
    owner: "Kwabena Darko",
    whatsapp: "+233559112233",
    icon: "🐟",
    tagline: "Grilled tilapia with banku, spicy beef suya & snails"
  },
  {
    id: "store-food-4",
    name: "Starbites Accra Cafe & Pastries",
    slug: "starbites-cafe",
    districtId: "district-food",
    zone: "food",
    stallNumber: "Stall F4",
    category: "food",
    themeColor: 0x9333ea, // Vibrant Violet
    hexColor: "#9333ea",
    owner: "Belinda Adjei",
    whatsapp: "+233242667788",
    icon: "☕",
    tagline: "Flaky golden meat pies, infused sobolo & chilled boba"
  },

  // ============================================================
  //  5. FASHION, BEAUTY & LIFESTYLE ARCADE (4 VENDORS)
  // ============================================================
  {
    id: "store-fash-1",
    name: "Royal Bonwire Kente Palace",
    slug: "bonwire-kente",
    districtId: "district-fashion",
    zone: "fashion",
    stallNumber: "Stall C1",
    category: "fashion",
    themeColor: 0xeab308, // Asante Gold
    hexColor: "#eab308",
    owner: "Nana Osei Tutu",
    whatsapp: "+233245889911",
    icon: "👑",
    tagline: "Handwoven Kumasi Bonwire Kente cloth, sashes & stoles"
  },
  {
    id: "store-fash-2",
    name: "Accra Streetwear Club",
    slug: "accra-streetwear",
    districtId: "district-fashion",
    zone: "fashion",
    stallNumber: "Stall C2",
    category: "fashion",
    themeColor: 0x14b8a6, // Teal
    hexColor: "#14b8a6",
    owner: "Seyram Kpodo",
    whatsapp: "+233550223399",
    icon: "👕",
    tagline: "Heavyweight boxy tees, Black Star caps & cargo pants"
  },
  {
    id: "store-beauty-1",
    name: "Madina Shea Glow & Naturals",
    slug: "madina-shea",
    districtId: "district-fashion",
    zone: "fashion",
    stallNumber: "Stall C3",
    category: "beauty",
    themeColor: 0x84cc16, // Lime
    hexColor: "#84cc16",
    owner: "Mariama Yakubu",
    whatsapp: "+233203445566",
    icon: "✨",
    tagline: "Unrefined Tamale yellow shea butter, black soap & oils"
  },
  {
    id: "store-beauty-2",
    name: "Osu Arabian Oud & Fragrance Bar",
    slug: "osu-oud-palace",
    districtId: "district-fashion",
    zone: "fashion",
    stallNumber: "Stall C4",
    category: "beauty",
    themeColor: 0x7c3aed, // Royal Oud Violet
    hexColor: "#7c3aed",
    owner: "Tariq Al-Hassan",
    whatsapp: "+233541887766",
    icon: "🧴",
    tagline: "Long-lasting luxury perfume oils, bukhoor & Arabian incense"
  }
];

export const PRODUCTS = [
  // ============================================================
  //  1. KWAME'S KICKS (STALL S1)
  // ============================================================
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
    color: "#ef4444",
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
    color: "#111827",
    variants: ["EU 40", "EU 42", "EU 43", "EU 44"]
  },

  // ============================================================
  //  2. ABENA LUXURY FOOTWEAR (STALL S2)
  // ============================================================
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
    color: "#ec4899",
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
    color: "#78350f",
    variants: ["EU 41", "EU 42", "EU 43", "EU 44"]
  },

  // ============================================================
  //  3. OSU THRIFT & RETRO KICKS (STALL S3)
  // ============================================================
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
    color: "#10b981",
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
    description: "Timeless indoor soccer heritage low-top with supple leather upper and durable gum rubber sole.",
    boxColor: 0x06b6d4,
    color: "#06b6d4",
    variants: ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44"]
  },

  // ============================================================
  //  4. ACCRA SLIDE CITY & CARE (STALL S4)
  // ============================================================
  {
    id: "prod-slide-1",
    storeId: "store-shoes-4",
    name: "Yeezy Slide 'Onyx' Lightweight",
    price: 240,
    stock: 14,
    category: "shoes",
    shelfId: "shelf-s4-1",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500&auto=format&fit=crop&q=80",
    description: "Injected EVA foam cushioning for lightweight durability with strategic groove placement for optimal traction.",
    boxColor: 0xf59e0b,
    color: "#f59e0b",
    variants: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
  },
  {
    id: "prod-slide-2",
    storeId: "store-shoes-4",
    name: "Crep Sneaker Rain & Stain Shield Kit",
    price: 130,
    stock: 22,
    category: "shoes",
    shelfId: "shelf-s4-2",
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&auto=format&fit=crop&q=80",
    description: "Hydrophobic spray shield with cleaning cure solution and hog hair brush. Keeps kicks brand new.",
    boxColor: 0x1e293b,
    color: "#1e293b",
    variants: ["Standard 200ml Kit"]
  },

  // ============================================================
  //  5. KOJO TECH HUB (STALL E1)
  // ============================================================
  {
    id: "prod-tech-1",
    storeId: "store-tech-1",
    name: "Apple AirPods Pro (2nd Gen) USB-C",
    price: 680,
    stock: 6,
    category: "electronics",
    shelfId: "shelf-e1-1",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80",
    description: "Up to 2x more Active Noise Cancellation with Transparency mode, Personalized Spatial Audio, and MagSafe charging.",
    boxColor: 0x3b82f6,
    color: "#3b82f6",
    variants: ["White USB-C Case"]
  },
  {
    id: "prod-tech-2",
    storeId: "store-tech-1",
    name: "Apple 20W USB-C Fast Charger & Cable",
    price: 180,
    stock: 20,
    category: "electronics",
    shelfId: "shelf-e1-2",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80",
    description: "Original Apple power adapter with 1m braided USB-C charging cable. Charges iPhone to 50% in 30 minutes.",
    boxColor: 0x60a5fa,
    color: "#60a5fa",
    variants: ["Standard UK 3-Pin"]
  },

  // ============================================================
  //  6. ACCRA GADGET WORLD (STALL E2)
  // ============================================================
  {
    id: "prod-tech-3",
    storeId: "store-tech-2",
    name: "Anker 737 PowerBank 24,000mAh (140W)",
    price: 490,
    stock: 8,
    category: "electronics",
    shelfId: "shelf-e2-1",
    image: "https://images.unsplash.com/photo-1609592426507-42861c8c279c?w=500&auto=format&fit=crop&q=80",
    description: "High-capacity ultra-fast power bank with smart digital display. Powerful enough to fast-charge a MacBook Pro.",
    boxColor: 0x8b5cf6,
    color: "#8b5cf6",
    variants: ["Space Gray"]
  },
  {
    id: "prod-tech-4",
    storeId: "store-tech-2",
    name: "Oraimo FreePods 4 ANC Earbuds",
    price: 210,
    stock: 15,
    category: "electronics",
    shelfId: "shelf-e2-2",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    description: "35.5-hour playtime with heavy bass boost, 4-mic call noise reduction, and custom EQ through the Oraimo Sound App.",
    boxColor: 0xa855f7,
    color: "#a855f7",
    variants: ["Shadow Black", "Frost Blue"]
  },

  // ============================================================
  //  7. ISTORE OSU SPECIALIST (STALL E3)
  // ============================================================
  {
    id: "prod-tech-5",
    storeId: "store-tech-3",
    name: "iPhone 15 Pro MagSafe Silicone Case",
    price: 195,
    stock: 12,
    category: "electronics",
    shelfId: "shelf-e3-1",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&auto=format&fit=crop&q=80",
    description: "Silky soft-touch exterior with microfiber lining and built-in magnets for seamless MagSafe wireless alignment.",
    boxColor: 0x0284c7,
    color: "#0284c7",
    variants: ["Storm Blue", "Clay Brown", "Midnight Black"]
  },
  {
    id: "prod-tech-6",
    storeId: "store-tech-3",
    name: "Apple Watch Ultra Ocean Band",
    price: 260,
    stock: 9,
    category: "electronics",
    shelfId: "shelf-e3-2",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80",
    description: "Molded from fluoroelastomer elastomer with tubular geometry. Engineered for water sports and everyday athletic wear.",
    boxColor: 0xf97316,
    color: "#f97316",
    variants: ["Vibrant Orange", "Midnight Navy", "Pure White"]
  },

  // ============================================================
  //  8. COMPUGHANA CIRCLE (STALL E4)
  // ============================================================
  {
    id: "prod-tech-7",
    storeId: "store-tech-4",
    name: "Logitech MX Master 3S Wireless Mouse",
    price: 430,
    stock: 7,
    category: "electronics",
    shelfId: "shelf-e4-1",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
    description: "Quiet click switches with 8K DPI glass tracking sensor and MagSpeed electromagnetic scroll wheel.",
    boxColor: 0x6366f1,
    color: "#6366f1",
    variants: ["Graphite Black", "Pale Grey"]
  },
  {
    id: "prod-tech-8",
    storeId: "store-tech-4",
    name: "Keychron K2 Wireless Mechanical Keyboard",
    price: 490,
    stock: 5,
    category: "electronics",
    shelfId: "shelf-e4-2",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    description: "Compact 75% layout wireless keyboard with hot-swappable Gateron G Pro Brown switches and RGB backlighting.",
    boxColor: 0x4f46e5,
    color: "#4f46e5",
    variants: ["Gateron Brown", "Gateron Red"]
  },

  // ============================================================
  //  9. OSU FRESH MART (STALL G1)
  // ============================================================
  {
    id: "prod-groc-1",
    storeId: "store-groc-1",
    name: "Kingsbite Ghana Milk Chocolate 100g (Pack of 5)",
    price: 85,
    stock: 35,
    category: "groceries",
    shelfId: "shelf-g1-1",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80",
    description: "Ghana's legendary 100% pure premium cocoa butter milk chocolate. Crafted by the Cocoa Processing Company in Tema.",
    boxColor: 0x10b981,
    color: "#10b981",
    variants: ["5-Bar Value Pack"]
  },
  {
    id: "prod-groc-2",
    storeId: "store-groc-1",
    name: "Golden Tree Choco-Bake Drinking Cocoa 400g",
    price: 65,
    stock: 24,
    category: "groceries",
    shelfId: "shelf-g1-2",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80",
    description: "Rich unsweetened natural cocoa powder, rich in antioxidants. Perfect for warm morning beverages and pastries.",
    boxColor: 0x047857,
    color: "#047857",
    variants: ["400g Tin"]
  },

  // ============================================================
  //  10. MAKOLA SPICE & ORGANIC GRAINS (STALL G2)
  // ============================================================
  {
    id: "prod-groc-3",
    storeId: "store-groc-2",
    name: "Authentic Homestyle Black Pepper Shito (500g Jar)",
    price: 60,
    stock: 30,
    category: "groceries",
    shelfId: "shelf-g2-1",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80",
    description: "Slow-cooked black pepper condiment with dried crayfish, shrimp, ginger, garlic, and scotch bonnet peppers.",
    boxColor: 0xd97706,
    color: "#d97706",
    variants: ["Mild Shrimp", "Extra Hot Fish"]
  },
  {
    id: "prod-groc-4",
    storeId: "store-groc-2",
    name: "Premium Crispy Volta Gari White (2kg Bag)",
    price: 45,
    stock: 40,
    category: "groceries",
    shelfId: "shelf-g2-2",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
    description: "Stone-free crispy fermented cassava flakes from the Volta Region. Supreme for Gari Foto or ice-water soaks.",
    boxColor: 0xf59e0b,
    color: "#f59e0b",
    variants: ["2kg Cloth Sack"]
  },

  // ============================================================
  //  11. DANPONG WELLNESS & PANTRY (STALL G3)
  // ============================================================
  {
    id: "prod-groc-5",
    storeId: "store-groc-3",
    name: "Raw Forest Honey from Nsawam (1 Litre)",
    price: 110,
    stock: 18,
    category: "groceries",
    shelfId: "shelf-g3-1",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
    description: "Unfiltered 100% natural wild comb honey harvested from the pristine forest belts of the Eastern Region.",
    boxColor: 0x059669,
    color: "#059669",
    variants: ["1L Glass Bottle"]
  },
  {
    id: "prod-groc-6",
    storeId: "store-groc-3",
    name: "Organic Ghanaian Moringa Leaf Powder (250g)",
    price: 55,
    stock: 25,
    category: "groceries",
    shelfId: "shelf-g3-2",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80",
    description: "Sun-dried pulverized nutrient-dense superfood powder. Packed with natural plant proteins, iron, and vitamin A.",
    boxColor: 0x10b981,
    color: "#10b981",
    variants: ["250g Pouch"]
  },

  // ============================================================
  //  12. GOLDEN TREE SWEET EMPORIUM (STALL G4)
  // ============================================================
  {
    id: "prod-groc-7",
    storeId: "store-groc-4",
    name: "Golden Tree Pebbles Milk Candies (500g Pouch)",
    price: 70,
    stock: 32,
    category: "groceries",
    shelfId: "shelf-g4-1",
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=500&auto=format&fit=crop&q=80",
    description: "Candy-coated roasted Ghanaian peanut centers wrapped in delicious creamy milk chocolate.",
    boxColor: 0xb45309,
    color: "#b45309",
    variants: ["500g Party Pack"]
  },
  {
    id: "prod-groc-8",
    storeId: "store-groc-4",
    name: "Tetteh Quarshie 70% Dark Cocoa Bar (Pack of 3)",
    price: 65,
    stock: 20,
    category: "groceries",
    shelfId: "shelf-g4-2",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&auto=format&fit=crop&q=80",
    description: "Tribute bar named after the pioneer who introduced cocoa to Ghana in 1879. Intense antioxidant-rich dark flavor.",
    boxColor: 0x78350f,
    color: "#78350f",
    variants: ["3-Bar Collector Pack"]
  },

  // ============================================================
  //  13. CHORKOR CHOP BAR & PIZZA (STALL F1)
  // ============================================================
  {
    id: "prod-food-1",
    storeId: "store-food-1",
    name: "Ghana Party Jollof & Spicy Grilled Chicken",
    price: 75,
    stock: 40,
    category: "food",
    shelfId: "shelf-f1-1",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    description: "Smoky firewood-steamed Ghanaian jollof rice served with juicy peri-peri grilled quarter chicken and sweet kelewele.",
    boxColor: 0xf97316,
    color: "#f97316",
    variants: ["Quarter Chicken", "Half Chicken (+GHS 35)"]
  },
  {
    id: "prod-food-2",
    storeId: "store-food-1",
    name: "Woodfired Accra Suya & Pepperoni Pizza",
    price: 120,
    stock: 15,
    category: "food",
    shelfId: "shelf-f1-2",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
    description: "Crispy hand-stretched dough with spicy beef suya spices, Italian mozzarella, bell peppers, and smoked beef pepperoni.",
    boxColor: 0xe11d48,
    color: "#e11d48",
    variants: ["Medium 12-inch", "Large 16-inch (+GHS 40)"]
  },

  // ============================================================
  //  14. ASANKA LOCAL CHOP HOUSE (STALL F2)
  // ============================================================
  {
    id: "prod-food-3",
    storeId: "store-food-2",
    name: "Traditional Fufu with Goat Meat Light Soup",
    price: 80,
    stock: 25,
    category: "food",
    shelfId: "shelf-f2-1",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80",
    description: "Silky pounded cassava and plantain fufu served in an authentic earthen asanka with fiery tomato-ginger goat broth.",
    boxColor: 0xe11d48,
    color: "#e11d48",
    variants: ["Goat Meat", "Fresh Tilapia Fish"]
  },
  {
    id: "prod-food-4",
    storeId: "store-food-2",
    name: "Fried Red Fish with Hot Ga Kenkey (2 Balls)",
    price: 65,
    stock: 30,
    category: "food",
    shelfId: "shelf-f2-2",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80",
    description: "Crispy fried whole red snapper accompanied by spicy fresh red and green pepper shito and hot fermented Ga corn kenkey.",
    boxColor: 0xd97706,
    color: "#d97706",
    variants: ["2 Kenkey Balls & Pepper"]
  },

  // ============================================================
  //  15. BUKA RESTAURANT EXPRESS (STALL F3)
  // ============================================================
  {
    id: "prod-food-5",
    storeId: "store-food-3",
    name: "Whole Grilled Tilapia with Hot Banku",
    price: 95,
    stock: 18,
    category: "food",
    shelfId: "shelf-f3-1",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80",
    description: "Volta Lake charcoal-grilled tilapia seasoned in ginger and local herbs, served with steaming banku and freshly ground pepper.",
    boxColor: 0xca8a04,
    color: "#ca8a04",
    variants: ["Jumbo Tilapia & 2 Banku"]
  },
  {
    id: "prod-food-6",
    storeId: "store-food-3",
    name: "Spicy Beef Suya Skewers (5 Sticks)",
    price: 50,
    stock: 35,
    category: "food",
    shelfId: "shelf-f3-2",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80",
    description: "Tender beef slices grilled over open charcoal, coated in northern kuli-kuli peanut powder and fiery dried chili spices.",
    boxColor: 0xf59e0b,
    color: "#f59e0b",
    variants: ["5 Skewers with Sliced Onions"]
  },

  // ============================================================
  //  16. STARBITES ACCRA CAFE & PASTRIES (STALL F4)
  // ============================================================
  {
    id: "prod-food-7",
    storeId: "store-food-4",
    name: "Flaky Golden Ghanaian Meat Pies (Box of 4)",
    price: 55,
    stock: 28,
    category: "food",
    shelfId: "shelf-f4-1",
    image: "https://images.unsplash.com/photo-1621236378699-8597fee6a162?w=500&auto=format&fit=crop&q=80",
    description: "Buttery shortcrust pastry pockets stuffed with seasoned minced beef, potatoes, and fragrant thyme.",
    boxColor: 0x9333ea,
    color: "#9333ea",
    variants: ["Box of 4 (Beef)", "Box of 4 (Chicken)"]
  },
  {
    id: "prod-food-8",
    storeId: "store-food-4",
    name: "Chilled Hibiscus Sobolo Infused with Pineapple (750ml)",
    price: 35,
    stock: 40,
    category: "food",
    shelfId: "shelf-f4-2",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
    description: "Brewed hibiscus calyces with ginger, grains of selim (hwentia), and fresh crushed pineapple. Served ice-cold.",
    boxColor: 0xc026d3,
    color: "#c026d3",
    variants: ["750ml Glass Bottle"]
  },

  // ============================================================
  //  17. ROYAL BONWIRE KENTE PALACE (STALL C1)
  // ============================================================
  {
    id: "prod-kente-1",
    storeId: "store-fash-1",
    name: "Handwoven Bonwire Kente Stole ('Adwinasa')",
    price: 340,
    stock: 10,
    category: "fashion",
    shelfId: "shelf-c1-1",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80",
    description: "Authentic double-woven silk-cotton Kente stole woven on traditional looms in Bonwire, Kumasi. Symbol of nobility.",
    boxColor: 0xeab308,
    color: "#eab308",
    variants: ["Gold & Maroon", "Blue & Yellow"]
  },
  {
    id: "prod-kente-2",
    storeId: "store-fash-1",
    name: "Handcrafted Royal Kente Graduation Sash",
    price: 180,
    stock: 22,
    category: "fashion",
    shelfId: "shelf-c1-2",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=500&auto=format&fit=crop&q=80",
    description: "Ceremonial graduation and milestone sash woven with Akan adinkra symbols including Gye Nyame and Sankofa.",
    boxColor: 0xf59e0b,
    color: "#f59e0b",
    variants: ["Standard Sash 72\""]
  },

  // ============================================================
  //  18. ACCRA STREETWEAR CLUB (STALL C2)
  // ============================================================
  {
    id: "prod-fash-1",
    storeId: "store-fash-2",
    name: "'Accra To The World' Heavyweight Boxy T-Shirt",
    price: 220,
    stock: 16,
    category: "fashion",
    shelfId: "shelf-c2-1",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    description: "280 GSM premium organic cotton drop-shoulder boxy tee with high-density screenprinted Accra typography.",
    boxColor: 0x14b8a6,
    color: "#14b8a6",
    variants: ["Medium", "Large", "X-Large", "XX-Large"]
  },
  {
    id: "prod-fash-2",
    storeId: "store-fash-2",
    name: "Vintage Ghana Black Star Snapback Cap",
    price: 140,
    stock: 19,
    category: "fashion",
    shelfId: "shelf-c2-2",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=80",
    description: "Structured 6-panel wool-blend cap featuring 3D embroidered Black Star emblem and green under-visor.",
    boxColor: 0x0f766e,
    color: "#0f766e",
    variants: ["One Size Fits All (Adjustable)"]
  },

  // ============================================================
  //  19. MADINA SHEA GLOW & NATURALS (STALL C3)
  // ============================================================
  {
    id: "prod-beauty-1",
    storeId: "store-beauty-1",
    name: "100% Pure Unrefined Tamale Shea Butter (500g Tub)",
    price: 65,
    stock: 35,
    category: "beauty",
    shelfId: "shelf-c3-1",
    image: "https://images.unsplash.com/photo-1608248597359-2696615b18bc?w=500&auto=format&fit=crop&q=80",
    description: "Cold-pressed golden yellow shea butter handcrafted by women's cooperatives in Northern Ghana. Deeply hydrating for skin and hair.",
    boxColor: 0x84cc16,
    color: "#84cc16",
    variants: ["500g Tub", "1kg Tub (+GHS 50)"]
  },
  {
    id: "prod-beauty-2",
    storeId: "store-beauty-1",
    name: "Traditional African Black Soap with Lavender Oil",
    price: 45,
    stock: 28,
    category: "beauty",
    shelfId: "shelf-c3-2",
    image: "https://images.unsplash.com/photo-1607006314644-8e100f7d5440?w=500&auto=format&fit=crop&q=80",
    description: "Raw black soap bar crafted from roasted plantain skins, cocoa pods, and virgin palm kernel oil with soothing lavender.",
    boxColor: 0x4d7c0f,
    color: "#4d7c0f",
    variants: ["250g Bar"]
  },

  // ============================================================
  //  20. OSU ARABIAN OUD & FRAGRANCE BAR (STALL C4)
  // ============================================================
  {
    id: "prod-beauty-3",
    storeId: "store-beauty-2",
    name: "Pure Royal Amber & White Musk Oil (12ml)",
    price: 180,
    stock: 14,
    category: "beauty",
    shelfId: "shelf-c4-1",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80",
    description: "Concentrated alcohol-free pure perfume attar oil. 24-hour longevity with warm amber and powdery musk sillage.",
    boxColor: 0x7c3aed,
    color: "#7c3aed",
    variants: ["12ml Crystal Bottle"]
  },
  {
    id: "prod-beauty-4",
    storeId: "store-beauty-2",
    name: "Smoky Arabian Oud Eau de Parfum (100ml Spray)",
    price: 320,
    stock: 8,
    category: "beauty",
    shelfId: "shelf-c4-2",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80",
    description: "Intense woody oriental fragrance blending Cambodian agarwood, damask rose, and smoky cedarwood.",
    boxColor: 0x5b21b6,
    color: "#5b21b6",
    variants: ["100ml Heavy Glass Spray"]
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9421",
    customerName: "Kweku Boateng",
    phone: "0244112233",
    address: "East Legon, near American House, Accra",
    storeId: "store-shoes-1",
    storeName: "Kwame's Kicks",
    items: [{ name: "Nike Air Jordan 1 High OG (Chicago)", qty: 1, price: 480 }],
    total: 480.00,
    status: "paid",
    fulfillment: "preparing",
    network: "MTN MoMo",
    reference: "PAY-GH-88192",
    time: "10 mins ago"
  },
  {
    id: "ORD-8822",
    customerName: "Ama Serwaa",
    phone: "0559988776",
    address: "Airport Residential Area, 4th Circular Rd",
    storeId: "store-tech-1",
    storeName: "Kojo Tech Hub",
    items: [{ name: "Apple AirPods Pro (2nd Gen)", qty: 1, price: 680 }],
    total: 680.00,
    status: "paid",
    fulfillment: "dispatched",
    network: "Telecel Cash",
    reference: "PAY-GH-99124",
    time: "32 mins ago"
  },
  {
    id: "ORD-7612",
    customerName: "Fiifi Mensah",
    phone: "0201234567",
    address: "Cantonments, near Embassy of France",
    storeId: "store-food-1",
    storeName: "Chorkor Chop Bar & Pizza",
    items: [
      { name: "Ghana Party Jollof & Spicy Chicken", qty: 2, price: 75 },
      { name: "Chilled Hibiscus Sobolo", qty: 2, price: 35 }
    ],
    total: 220.00,
    status: "paid",
    fulfillment: "preparing",
    network: "AT Money",
    reference: "PAY-GH-55102",
    time: "1 hour ago"
  },
  {
    id: "ORD-6531",
    customerName: "Akosua Dentaa",
    phone: "0245678901",
    address: "Osu Ringway Estate, Accra",
    storeId: "store-fash-1",
    storeName: "Royal Bonwire Kente Palace",
    items: [{ name: "Handwoven Bonwire Kente Stole ('Adwinasa')", qty: 1, price: 340 }],
    total: 340.00,
    status: "paid",
    fulfillment: "preparing",
    network: "MTN MoMo",
    reference: "PAY-GH-66190",
    time: "2 hours ago"
  }
];
