import heroMulcher from "../assets/images/hero-mulcher.png";
import mulcherAction1 from "../assets/images/mulcher-action-1.png";
import mulcherAction2 from "../assets/images/mulcher-action-2.png";
import clearedLotResult from "../assets/images/cleared-lot-result.png";
import mulcherApproaching from "../assets/images/mulcher-approaching.png";
import aerialClearing from "../assets/images/aerial-clearing.png";

export const STOCK_IMAGES = {
  hero: heroMulcher,
  forestryMulching: mulcherAction2,
  trailCutting: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  hillsideMulching: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  brushHogging: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
  fenceLineClearing: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  invasiveRemoval: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
  heavyEquipment: mulcherApproaching,
  clearedLand: clearedLotResult,
  forest: mulcherAction1,
  overgrown: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80",
  charlotteAerial: "https://images.unsplash.com/photo-1560523159-6b681a1e1852?w=1920&q=80",
  teamWork: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  ruralProperty: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
  aerialClearing: aerialClearing,
} as const;

export const SERVICE_IMAGES: Record<string, string> = {
  "forestry-mulching": STOCK_IMAGES.forestryMulching,
  "trail-cutting": STOCK_IMAGES.trailCutting,
  "hillside-mulching": STOCK_IMAGES.hillsideMulching,
  "brush-hogging": STOCK_IMAGES.brushHogging,
  "fence-line-clearing": STOCK_IMAGES.fenceLineClearing,
  "invasive-growth-removal": STOCK_IMAGES.invasiveRemoval,
};
