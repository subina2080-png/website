export const SUBINA_PROFILE = {
  name: "Subina Aacharya",
  title: "Certified RYT-500 Yoga Instructor & Mindfulness Mentor",
  bio: "Dedicated to guiding individuals back to their inner sanctuary through intentional vinyasa flow, restorative pranayama, and holistic mindful living. With over 8+ years of dedicated practice across Nepal and internationally, Subina brings ancient wisdom into modern daily routines.",
  location: "Kathmandu Valley & Online Globally",
  experienceYears: 8,
  studentsCount: "3,500+",
  articlesWritten: 45,
  certifications: ["RYT-500 Registered Yoga Teacher", "Pranayama & Breath Master", "Chakra Energy Practitioner", "Somatic Movement Specialist"],
  avatar: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
  heroBannerBg: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80"
};

export const DAILY_ZEN_QUOTES = [
  { quote: "Yoga is the journey of the self, through the self, to the self.", source: "The Bhagavad Gita" },
  { quote: "Inhale peace, exhale noise. The stillness you seek resides within your breath.", source: "Subina Aacharya" },
  { quote: "Quiet the mind, and the soul will speak.", source: "Ma Jaya Sati Bhagavati" },
  { quote: "Yoga is not about touching your toes. It is about what you learn on the way down.", source: "Jigar Gor" },
  { quote: "Surrender to what is, let go of what was, have faith in what will be.", source: "Sonia Ricotti" }
];

export const BLOG_CATEGORIES = [
  "All Articles",
  "Vinyasa Flow",
  "Pranayama & Breathwork",
  "Chakra Healing",
  "Mindful Living",
  "Yoga Philosophy",
  "Beginner Guides"
];

const formatPostDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' });

// Every article is a JSON file in src/content/posts/. Add a file = add an article.
const postModules = import.meta.glob('../content/posts/*.json', { eager: true });

export const BLOG_POSTS = Object.values(postModules)
  .map((m) => m.default ?? m)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((post) => ({ ...post, dateISO: post.date, date: formatPostDate(post.date) }));

export const YOGA_POSES = [
  {
    id: "adho-mukha-svanasana",
    name: "Downward-Facing Dog",
    sanskrit: "Adho Mukha Svanasana",
    category: "Inversion / Strengthening",
    difficulty: "Beginner",
    benefits: "Lengthens spine, strengthens shoulders, energizes nervous system.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
    instructions: [
      "Start on hands and knees, hands slightly forward of shoulders.",
      "Tuck toes, lift knees off floor, and push hips back and up toward ceiling.",
      "Keep spine long, press down evenly through palms and index finger knuckles.",
      "Hold for 5 deep Ujjayi breath cycles."
    ]
  },
  {
    id: "vrksasana",
    name: "Tree Pose",
    sanskrit: "Vrksasana",
    category: "Standing Balance",
    difficulty: "Beginner",
    benefits: "Improves equilibrium, tones legs, fosters mental concentration.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    instructions: [
      "Shift weight onto right foot, root down firmly.",
      "Place sole of left foot against inner right calf or thigh (avoid knee joint).",
      "Bring palms together at heart center (Anjali Mudra).",
      "Fix gaze on a steady point (Drishti)."
    ]
  }
];

export const SUBSCRIPTION_TIERS = [
  {
    id: "zen-free",
    name: "Zen Explorer",
    subtitle: "Free Forever",
    priceMonthly: 0,
    priceYearly: 0,
    popular: false,
    badge: "Free Access",
    description: "Perfect for beginners exploring yoga philosophy, articles, and basic breathing exercises.",
    features: [
      "Access to all public blog posts & guides",
      "Interactive Pranayama Breathing Tool",
      "Basic Ambient Sound Generator",
      "Weekly Mindful Email Newsletter"
    ],
    buttonText: "Current Plan",
    buttonVariant: "btn-secondary"
  },
  {
    id: "sanctuary-monthly",
    name: "Sanctuary Member",
    subtitle: "Mindful Inner Practice",
    priceMonthly: 19,
    priceYearly: 15,
    popular: true,
    badge: "Most Popular",
    description: "Unlock full library of HD yoga video streams, guided audio meditations, and weekly live classes.",
    features: [
      "Everything in Zen Explorer",
      "Unlimited HD Vinyasa & Yin Class Video Streams",
      "Exclusive Monthly Guided Audio Meditations",
      "2x Monthly Live Zoom Yoga Sessions with Subina",
      "Private Member Community Chat & Q&A"
    ],
    buttonText: "Join Waitlist / Subscribe",
    buttonVariant: "btn-primary"
  },
  {
    id: "lotus-vip",
    name: "Lotus Circle VIP",
    subtitle: "Transformational Mentorship",
    priceMonthly: 49,
    priceYearly: 39,
    popular: false,
    badge: "VIP Mentorship",
    description: "Deep personalized yoga mentorship with 1-on-1 private instruction, custom posture reviews & chakra healing.",
    features: [
      "Everything in Sanctuary Member",
      "Monthly 60-Min 1-on-1 Private Virtual Yoga Session",
      "Personalized Weekly Practice Routine & Alignment Analysis",
      "Priority Access to Retreats & Workshops",
      "Direct WhatsApp / Messaging Access to Subina"
    ],
    buttonText: "Inquire for VIP Spot",
    buttonVariant: "btn-outline"
  }
];

export const UPCOMING_SCHEDULE = [
  {
    id: "sch-1",
    title: "Sunday Morning Vinyasa & Sunshine Flow",
    type: "Live Zoom Session",
    level: "All Levels",
    date: "Sunday, Aug 23, 2026",
    time: "8:00 AM - 9:15 AM NPT / GMT+5:45",
    spotsLeft: 4,
    instructor: "Subina Aacharya"
  },
  {
    id: "sch-2",
    title: "Full Moon Candlelight Yin & Sound Bath",
    type: "Special Event / Workshop",
    level: "Restorative",
    date: "Thursday, Aug 27, 2026",
    time: "7:00 PM - 8:30 PM NPT",
    spotsLeft: 2,
    instructor: "Subina Aacharya"
  }
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Aarati Sharma",
    role: "Software Engineer & Yogini",
    text: "Subina's calm voice and precise alignment guidance changed my relationship with stress. Her blog posts are pure gold for anyone looking for quiet moments during a hectic work week.",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "t2",
    name: "Marcus Vance",
    role: "Mindfulness Coach",
    text: "The breathwork visualizer on this platform is part of my daily morning ritual. Subina combines authentic tradition with modern ease seamlessly.",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];
