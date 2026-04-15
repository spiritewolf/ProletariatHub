import type { LucideIcon } from 'lucide-react';
import {
  Beef,
  Carrot,
  CupSoda,
  Home,
  Milk,
  Package,
  ShoppingBasket,
  SoapDispenserDroplet,
} from 'lucide-react';

const FALLBACK_ICON: LucideIcon = Package;

const ICON_BY_CATEGORY: Record<string, LucideIcon> = {
  Dairy: Milk,
  Cleaning: SoapDispenserDroplet,
  Produce: Carrot,
  Household: Home,
  Beverages: CupSoda,
  Pantry: ShoppingBasket,
};

export function getCategorySearchResultIcon(category: string | null): LucideIcon {
  if (category === null) {
    return FALLBACK_ICON;
  }
  const mapped = ICON_BY_CATEGORY[category];
  if (mapped !== undefined) {
    return mapped;
  }
  return Beef;
}
