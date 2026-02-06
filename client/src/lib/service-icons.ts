import {
  TreePine, Scissors, Axe, Mountain, Drill, Route,
  CloudLightning, BadgeDollarSign, MessageSquareText,
  Sparkles, Shield, Clock, Leaf, Fence, Bug
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  "land-clearing": TreePine,
  "brush-removal": Scissors,
  "forestry-mulching": Axe,
  "lot-clearing": Mountain,
  "stump-grinding": Drill,
  "driveway-trail-cutting": Route,
  "storm-cleanup": CloudLightning,
  "pricing": BadgeDollarSign,
  "value": BadgeDollarSign,
  "fast-quote": MessageSquareText,
  "trail-cutting": Leaf,
  "hillside-mulching": Mountain,
  "brush-hogging": Axe,
  "fence-line-clearing": Fence,
  "invasive-growth-removal": Bug,
  "equipment": Shield,
  "experience": Clock,
};

const TITLE_KEYWORDS: Record<string, LucideIcon> = {
  brush: Scissors,
  mulch: Axe,
  clear: TreePine,
  lot: Mountain,
  stump: Drill,
  trail: Route,
  storm: CloudLightning,
  price: BadgeDollarSign,
  quote: MessageSquareText,
  fence: Fence,
  invasive: Bug,
  hill: Mountain,
  slope: Mountain,
};

export function getServiceIcon(nameOrKey: string): LucideIcon {
  if (!nameOrKey) return Sparkles;

  const key = nameOrKey.toLowerCase().trim();

  if (SERVICE_ICON_MAP[key]) {
    return SERVICE_ICON_MAP[key];
  }

  for (const [keyword, icon] of Object.entries(TITLE_KEYWORDS)) {
    if (key.includes(keyword)) {
      return icon;
    }
  }

  return Sparkles;
}

export const ICON_SIZES = {
  card: { size: 20, strokeWidth: 1.75 },
  featured: { size: 28, strokeWidth: 1.75 },
  hero: { size: 32, strokeWidth: 1.75 },
} as const;
