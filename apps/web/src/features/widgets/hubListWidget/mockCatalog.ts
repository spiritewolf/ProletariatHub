export type MockProduct = {
  id: string;
  name: string;
  brand: string | null;
  vendorName: string | null;
  category: string | null;
  frequency: string;
};

export const MOCK_CATEGORIES = [
  'Dairy',
  'Cleaning',
  'Produce',
  'Household',
  'Beverages',
  'Pantry',
] as const;

export const MOCK_VENDORS = [
  "Trader Joe's",
  'Target',
  'Amazon',
  'Costco',
  'PetCo',
  'Whole Foods',
] as const;

export const MOCK_PRODUCT_CATALOG: MockProduct[] = [
  {
    id: 'cat-oat',
    name: 'Oat milk',
    brand: 'Oatly barista',
    vendorName: "Trader Joe's",
    category: 'Dairy',
    frequency: 'Weekly',
  },
  {
    id: 'cat-dish',
    name: 'Dish soap',
    brand: 'Dawn',
    vendorName: 'Amazon',
    category: 'Cleaning',
    frequency: 'Biweekly',
  },
  {
    id: 'cat-oat-creamer',
    name: 'Oat milk creamer',
    brand: 'Chobani',
    vendorName: "Trader Joe's",
    category: 'Dairy',
    frequency: 'Weekly',
  },
  {
    id: 'cat-paper',
    name: 'Paper towels',
    brand: 'Bounty',
    vendorName: 'Target',
    category: 'Household',
    frequency: 'Monthly',
  },
  {
    id: 'cat-coffee',
    name: 'Coffee beans',
    brand: 'Blue Bottle',
    vendorName: "Trader Joe's",
    category: 'Beverages',
    frequency: 'Weekly',
  },
  {
    id: 'cat-banana',
    name: 'Bananas',
    brand: 'Dole',
    vendorName: "Trader Joe's",
    category: 'Produce',
    frequency: 'Weekly',
  },
];
