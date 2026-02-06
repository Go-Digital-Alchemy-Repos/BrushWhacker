export const STOCK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80",
  landClearing: "https://images.unsplash.com/photo-1621922688758-8d99dad2a040?w=800&q=80",
  brushRemoval: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  forestryMulching: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
  lotClearing: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  stumpGrinding: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
  drivewayTrailCutting: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  stormCleanup: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80",
  skidSteer: "https://images.unsplash.com/photo-1580901368919-7738efb0f228?w=800&q=80",
  heavyMachinery: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  charlotteAerial: "https://images.unsplash.com/photo-1560523159-6b681a1e1852?w=1920&q=80",
  teamWork: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
  beforeAfter: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80",
  clearedLand: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  equipment: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
} as const;

export const SERVICE_IMAGES: Record<string, string> = {
  "land-clearing": STOCK_IMAGES.landClearing,
  "brush-removal": STOCK_IMAGES.brushRemoval,
  "forestry-mulching": STOCK_IMAGES.forestryMulching,
  "lot-clearing": STOCK_IMAGES.lotClearing,
  "stump-grinding": STOCK_IMAGES.stumpGrinding,
  "driveway-trail-cutting": STOCK_IMAGES.drivewayTrailCutting,
  "storm-cleanup": STOCK_IMAGES.stormCleanup,
};
