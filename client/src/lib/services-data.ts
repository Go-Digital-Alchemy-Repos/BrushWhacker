import { SERVICE_IMAGES } from "./stock-images";

export interface ServiceInfo {
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  features: string[];
  image: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    slug: "land-clearing",
    title: "Land Clearing",
    shortDesc: "Complete land clearing for residential and commercial properties.",
    description:
      "Our professional land clearing services prepare your property for construction, landscaping, or agricultural use. We handle everything from small residential lots to large commercial parcels with precision and efficiency.",
    features: [
      "Residential & commercial clearing",
      "Selective or full clearing options",
      "Debris removal and hauling",
      "Grading preparation",
      "Environmentally responsible methods",
    ],
    image: SERVICE_IMAGES["land-clearing"],
  },
  {
    slug: "brush-removal",
    title: "Brush Removal",
    shortDesc: "Thorough brush and undergrowth removal for cleaner property.",
    description:
      "Take back your property from overgrown brush and invasive vegetation. Our team uses specialized equipment to efficiently clear dense brush, leaving your land clean and manageable.",
    features: [
      "Overgrown lot restoration",
      "Invasive species removal",
      "Property line clearing",
      "Fire hazard reduction",
      "Ongoing maintenance programs",
    ],
    image: SERVICE_IMAGES["brush-removal"],
  },
  {
    slug: "forestry-mulching",
    title: "Forestry Mulching",
    shortDesc: "Eco-friendly mulching that returns nutrients to the soil.",
    description:
      "Forestry mulching is an eco-friendly land clearing method that grinds trees, brush, and stumps in place, creating a natural mulch layer that prevents erosion and returns nutrients to the soil.",
    features: [
      "Single-pass clearing",
      "No burning or hauling required",
      "Natural erosion control",
      "Soil nutrient preservation",
      "Minimal ground disturbance",
    ],
    image: SERVICE_IMAGES["forestry-mulching"],
  },
  {
    slug: "lot-clearing",
    title: "Lot Clearing",
    shortDesc: "Prepare lots for construction or landscaping projects.",
    description:
      "Whether you're building a new home, developing a commercial property, or creating usable outdoor space, our lot clearing services provide a clean slate for your project.",
    features: [
      "Construction site preparation",
      "Building pad clearing",
      "Utility easement clearing",
      "Subdivision development",
      "HOA and code compliance",
    ],
    image: SERVICE_IMAGES["lot-clearing"],
  },
  {
    slug: "stump-grinding",
    title: "Stump Grinding",
    shortDesc: "Professional stump removal for a clean, level property.",
    description:
      "Remove unsightly stumps that get in the way of mowing, landscaping, and building. Our powerful stump grinders can handle stumps of any size, grinding them below grade for a smooth finish.",
    features: [
      "Any size stump removal",
      "Below-grade grinding",
      "Root system treatment",
      "Backfill and leveling",
      "Multi-stump discounts",
    ],
    image: SERVICE_IMAGES["stump-grinding"],
  },
  {
    slug: "driveway-trail-cutting",
    title: "Driveway & Trail Cutting",
    shortDesc: "Custom driveway and trail clearing through wooded areas.",
    description:
      "Need access to a remote part of your property? We cut custom driveways, trails, and access roads through wooded and overgrown areas, creating safe and usable paths.",
    features: [
      "Custom path design",
      "Gravel driveway preparation",
      "Hiking and ATV trails",
      "Property access roads",
      "Drainage consideration",
    ],
    image: SERVICE_IMAGES["driveway-trail-cutting"],
  },
  {
    slug: "storm-cleanup",
    title: "Storm Cleanup",
    shortDesc: "Fast response storm debris and fallen tree cleanup.",
    description:
      "When storms strike the Charlotte area, our team responds quickly to help you recover. We handle fallen trees, debris removal, and emergency clearing to get your property safe and accessible again.",
    features: [
      "24/7 emergency response",
      "Fallen tree removal",
      "Debris clearing and hauling",
      "Insurance documentation support",
      "Property restoration",
    ],
    image: SERVICE_IMAGES["storm-cleanup"],
  },
];

export function getServiceBySlug(slug: string): ServiceInfo | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
