import { SERVICE_IMAGES } from "./stock-images";

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceInfo {
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  features: string[];
  image: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  bestFor: string[];
  whatsIncluded: string[];
  typicalProjects: string[];
  pricingFactors: string;
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
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
    metaTitle: "Land Clearing in Charlotte, NC | BrushWhackers",
    metaDescription: "Professional land clearing for residential and commercial properties across Charlotte, Mecklenburg County, and nearby areas. Skid steers, forestry mulchers, and purpose-built attachments. Free quotes.",
    h1: "Land Clearing in Charlotte, NC",
    intro: "BrushWhackers provides professional land clearing for residential and commercial properties across Charlotte, Mecklenburg County, and nearby areas. Whether you're preparing a home site, expanding usable acreage, or reclaiming an overgrown lot, we clear efficiently using skid steers and purpose-built attachments.",
    bestFor: [
      "Building pads and site prep",
      "Overgrown lots and neglected acreage",
      "Expansions for pasture or yard space",
      "Clearing for fencing and property lines",
    ],
    whatsIncluded: [
      "Clearing brush, vines, and light timber (scope-dependent)",
      "Mulching or piling per job needs",
      "Clean edges along driveways, fence lines, and structures",
      "Optional haul-off coordination",
    ],
    typicalProjects: [
      "Residential lots in Matthews and Mint Hill",
      "Small acreage in Union and Cabarrus counties",
      "Light commercial clearing around Concord and Huntersville",
    ],
    pricingFactors: "Land clearing pricing depends on lot size, vegetation density, terrain accessibility, and scope of work. Visit our pricing page for general ranges, or request a free on-site estimate for an accurate quote.",
    faqs: [
      { q: "Do you handle permits?", a: "Permits depend on the municipality and scope of work. In most cases, the property owner is responsible for obtaining clearing permits, but we can advise you on what's typically required in Mecklenburg, Union, and Cabarrus counties." },
      { q: "Can you clear near fences?", a: "Yes. We carefully clear up to fence lines and structures using the right equipment and approach to avoid damage. We'll walk the site with you beforehand to identify sensitive areas." },
      { q: "Will you remove stumps?", a: "We offer stump grinding as a separate service that pairs well with land clearing. We can include it in your estimate if needed." },
      { q: "How fast can you start?", a: "Most projects are scheduled within 1\u20132 weeks of the estimate, depending on the season and job size. Emergency or time-sensitive work may be accommodated sooner." },
    ],
    relatedSlugs: ["brush-removal", "forestry-mulching", "lot-clearing", "stump-grinding"],
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
    metaTitle: "Brush Removal in Charlotte, NC | BrushWhackers",
    metaDescription: "Expert brush removal services in Charlotte and surrounding areas. Restore visibility and usable space by clearing briars, saplings, and dense undergrowth. Free estimates available.",
    h1: "Brush Removal in Charlotte, NC",
    intro: "If your property is getting swallowed by briars, saplings, and dense undergrowth, BrushWhackers can restore visibility and usable space quickly. We specialize in brush removal that makes land manageable again.",
    bestFor: [
      "Fence line clearing",
      "Backyard overgrowth",
      "Right-of-way and easement access",
      "Prepping lots for landscaping",
    ],
    whatsIncluded: [
      "Cutting and mulching brush and small saplings",
      "Edge cleanup around structures",
      "Safe approach around utilities (locates required)",
    ],
    typicalProjects: [
      "Overgrown corners of lots in south Charlotte",
      "Property boundaries in Gaston County",
      "Brush reduction near Lake Norman",
    ],
    pricingFactors: "Brush removal pricing varies based on the density of growth, lot size, and how close the work is to structures or utilities. Contact us for a free on-site estimate tailored to your property.",
    faqs: [
      { q: "How thick of brush can you handle?", a: "We can clear everything from light undergrowth to dense stands of briars, saplings up to several inches in diameter, and invasive vines. Our equipment is purpose-built for heavy brush." },
      { q: "Will you handle utility locates?", a: "We require utility locates to be completed before we work near any underground lines. We can guide you through the process of scheduling a free locate through NC 811." },
      { q: "Do you remove the roots?", a: "Brush removal typically involves cutting at ground level and mulching. If root removal is needed, we can discuss stump grinding or additional soil work." },
      { q: "Can you clear fence lines without damaging fences?", a: "Yes, we're experienced at clearing right up to fence lines while protecting the fence structure. We use the right attachments and approach for the job." },
    ],
    relatedSlugs: ["land-clearing", "forestry-mulching", "storm-cleanup"],
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
    metaTitle: "Forestry Mulching in Charlotte, NC | BrushWhackers",
    metaDescription: "Forestry mulching services in Charlotte, NC. Clear brush and light timber without hauling debris. Skid steer with forestry mulcher attachment. Faster, cleaner, cost-effective. Free quotes.",
    h1: "Forestry Mulching in Charlotte, NC",
    intro: "Forestry mulching is one of the fastest ways to clear brush and light timber without hauling piles of debris. Using a skid steer with a forestry mulcher, we turn vegetation into mulch on-site \u2014 cleaner, faster, and often more cost-effective.",
    bestFor: [
      "Acreage cleanup",
      "Understory thinning",
      "Trail and access path creation",
      "Invasive species reduction",
    ],
    whatsIncluded: [
      "Mulching vegetation to ground level",
      "Creating a more walkable, maintainable surface",
      "Selective clearing (keep desirable trees)",
    ],
    typicalProjects: [
      "Acreage cleanup in Union County",
      "Trail cuts in Cabarrus County",
      "Brush reduction near Huntersville and Belmont",
    ],
    pricingFactors: "Forestry mulching pricing is typically based on acreage, density of vegetation, and terrain. It's often more cost-effective than traditional clearing because there's no hauling. Request a free estimate for your property.",
    faqs: [
      { q: "What's the difference between forestry mulching and traditional clearing?", a: "Traditional clearing involves cutting, piling, and hauling debris off-site. Forestry mulching grinds everything in place, leaving a natural mulch layer. It's faster, often cheaper, and better for soil health." },
      { q: "Can you mulch around specific trees I want to keep?", a: "Absolutely. Selective clearing is one of the biggest advantages of forestry mulching. We can work around any trees you want to preserve." },
      { q: "How thick of trees can you mulch?", a: "Our forestry mulcher handles trees and saplings up to approximately 6\u20138 inches in diameter. Larger trees may require cutting first, then mulching." },
      { q: "Is forestry mulching good for erosion control?", a: "Yes. The mulch layer left behind helps prevent erosion, retains moisture, and adds nutrients back into the soil as it decomposes." },
    ],
    relatedSlugs: ["land-clearing", "brush-removal", "driveway-trail-cutting"],
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
    metaTitle: "Lot Clearing in Charlotte, NC | BrushWhackers",
    metaDescription: "Professional lot clearing for new construction, additions, and outbuildings in the Charlotte, NC area. Clean staging areas, access prep, and drainage-conscious clearing. Free estimates.",
    h1: "Lot Clearing in Charlotte, NC",
    intro: "Preparing a lot for a new home, addition, or outbuilding? BrushWhackers clears lots with an eye toward access, drainage, and clean staging areas. We serve builders, homeowners, and developers across Mecklenburg County and surrounding areas.",
    bestFor: [
      "New construction prep",
      "Utility access",
      "Clearing for grading and excavation teams",
    ],
    whatsIncluded: [
      "Removal of brush and light timber",
      "Clean working areas for next trades",
      "Optional coordination for haul-off",
    ],
    typicalProjects: [
      "New home sites in south Charlotte and Matthews",
      "Outbuilding and shop pads in Union County",
      "Subdivision lot prep in Concord and Kannapolis",
    ],
    pricingFactors: "Lot clearing pricing is driven by lot size, vegetation density, and the level of finish required. Some builders need a clean-scraped pad; others just need brush cleared. We'll tailor the scope to your needs.",
    faqs: [
      { q: "Can you work with my builder's timeline?", a: "Yes. We coordinate with builders and general contractors regularly. We can schedule our work to fit your construction timeline and hand off a clean site." },
      { q: "Do you handle tree protection during clearing?", a: "If there are trees that need to be preserved per your site plan or local tree ordinance, we'll flag and protect them during the clearing process." },
      { q: "What do you do with the cleared material?", a: "Depending on the job, we can mulch material on-site, pile it for pickup, or coordinate haul-off. We'll discuss the best approach during your estimate." },
      { q: "Do you work in subdivisions with HOA requirements?", a: "Yes. We're familiar with working within HOA guidelines and local ordinances. We keep the site clean and minimize disruption to neighboring properties." },
    ],
    relatedSlugs: ["land-clearing", "stump-grinding", "driveway-trail-cutting"],
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
    metaTitle: "Stump Grinding in Charlotte, NC | BrushWhackers",
    metaDescription: "Stump grinding services in Charlotte, NC. Remove trip hazards and obstacles for mowing, grading, and landscaping. Practical depth grinding with cleanup options. Free quotes.",
    h1: "Stump Grinding in Charlotte, NC",
    intro: "Stumps are trip hazards and obstacles for mowing, grading, and landscaping. We grind stumps to help you finish your project cleanly. Serving Charlotte, Matthews, Huntersville, Concord, and surrounding areas.",
    bestFor: [
      "Post-tree removal cleanup",
      "Yard restoration",
      "Clearing for driveways or pads",
    ],
    whatsIncluded: [
      "Stump grinding to practical depth (typically 6\u201312 inches below grade)",
      "Cleanup options (mulch left on-site or hauled)",
    ],
    typicalProjects: [
      "Backyard stump removal in Charlotte neighborhoods",
      "Multi-stump projects in Mint Hill and Matthews",
      "Post-storm stump cleanup across Mecklenburg County",
    ],
    pricingFactors: "Stump grinding is typically priced per stump based on diameter, with discounts for multiple stumps. Accessibility and root exposure also factor in. Request a free estimate for exact pricing.",
    faqs: [
      { q: "How deep do you grind?", a: "We grind stumps to a practical depth of 6\u201312 inches below grade, which is sufficient for most landscaping, sodding, and building purposes." },
      { q: "What happens to the wood chips?", a: "The grinding produces wood chips and mulch. We can leave it on-site for you to use, backfill the hole, or haul it away \u2014 your choice." },
      { q: "Can you grind stumps near structures or fences?", a: "Yes, we can work close to structures, fences, and sidewalks. We'll assess access and clearance during the estimate." },
      { q: "Do you remove the roots too?", a: "Stump grinding removes the stump and the top portion of the root ball. Lateral roots that extend underground will decay naturally over time." },
    ],
    relatedSlugs: ["land-clearing", "lot-clearing", "storm-cleanup"],
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
    metaTitle: "Driveway & Trail Cutting in the Charlotte Area | BrushWhackers",
    metaDescription: "Driveway and trail cutting services in the Charlotte, NC area. Create access lanes, hunting trails, and paths through wooded areas. Professional equipment for any terrain. Free estimates.",
    h1: "Driveway & Trail Cutting in the Charlotte Area",
    intro: "Need access to the back of your property or a clean path through wooded areas? BrushWhackers creates functional trails and access lanes using the right equipment for the terrain. We serve properties across Charlotte, Lake Norman, Union County, and beyond.",
    bestFor: [
      "Hunting and recreation trails",
      "Access to ponds, fences, and back acreage",
      "Driveway extensions (pre-grade prep)",
    ],
    whatsIncluded: [
      "Clearing lane to your specified width",
      "Trimming edges for a clean look",
      "Mulching or cut-and-pile based on goals",
    ],
    typicalProjects: [
      "Hunting trails on rural properties in Union County",
      "Pond access lanes in Cabarrus County",
      "Driveway extensions in the Lake Norman area",
    ],
    pricingFactors: "Trail and driveway cutting pricing depends on length, width, terrain, and vegetation density. We price by the linear foot or by the project. Request a free estimate for your specific needs.",
    faqs: [
      { q: "How wide can you cut a trail?", a: "We can cut trails and access lanes from a narrow walking path up to a full-width driveway. We'll discuss your intended use and recommend the right width." },
      { q: "Can you handle hilly terrain?", a: "Yes. Our equipment is built for rough and hilly terrain. We'll evaluate slope and soil conditions during the estimate to plan the safest approach." },
      { q: "Do you prep for gravel or paving?", a: "We clear and rough-grade the path to prepare it for gravel, crushed stone, or paving. We can coordinate with grading and paving contractors if needed." },
      { q: "Will the trail be usable right away?", a: "In most cases, yes. After clearing and mulching, the trail surface is walkable and often driveable for lighter vehicles. Additional grading or gravel may be needed for heavy use." },
    ],
    relatedSlugs: ["forestry-mulching", "land-clearing", "lot-clearing"],
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
    metaTitle: "Storm Cleanup & Debris Removal in Charlotte, NC | BrushWhackers",
    metaDescription: "Storm cleanup and debris removal in Charlotte, NC. Fast response for downed limbs, fallen trees, and storm damage. Residential and small commercial. Free estimates.",
    h1: "Storm Cleanup & Debris Removal in Charlotte, NC",
    intro: "After high winds or severe storms, downed limbs and debris can block access and create safety issues. We help property owners across Charlotte, Mecklenburg County, and surrounding areas restore access quickly.",
    bestFor: [
      "Downed limbs and brush piles",
      "Clearing access after storms",
      "Cleanup for residential and small commercial properties",
    ],
    whatsIncluded: [
      "Brush reduction and debris consolidation",
      "Optional haul-off coordination",
      "Insurance documentation support with photos",
    ],
    typicalProjects: [
      "Post-storm driveway clearing in Charlotte neighborhoods",
      "Fallen tree cleanup in Huntersville and Concord",
      "Debris removal for HOA communities in south Charlotte",
    ],
    pricingFactors: "Storm cleanup pricing depends on the volume of debris, accessibility, and urgency. We offer competitive rates and can work with your insurance company's requirements. Contact us for a fast estimate.",
    faqs: [
      { q: "How quickly can you respond after a storm?", a: "We prioritize storm response and can typically be on-site within 24\u201348 hours of a major storm event. For emergencies blocking access or creating safety hazards, we respond even faster." },
      { q: "Do you work with insurance companies?", a: "Yes. We can provide documentation, photos, and itemized estimates to support your insurance claim. We've worked with many homeowners through the claims process." },
      { q: "Can you remove large fallen trees?", a: "Yes. We handle trees of all sizes, from small limbs to large trunks. We can cut, section, and remove or mulch trees on-site depending on the situation." },
      { q: "Do you do preventive cleanup before storm season?", a: "Absolutely. We can clear dead or leaning trees, remove overhanging limbs, and reduce brush that could become hazardous in high winds. This is a smart investment before hurricane season." },
    ],
    relatedSlugs: ["brush-removal", "stump-grinding", "land-clearing"],
  },
];

export function getServiceBySlug(slug: string): ServiceInfo | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
