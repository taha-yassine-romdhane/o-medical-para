export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
  isOnSale?: boolean;
  description: string;
}

export const sampleProducts: Product[] = [
  // Vitamines & Compléments
  {
    id: '1',
    name: 'Vitamine D3 2000 UI - 60 Gélules',
    brand: 'Solgar',
    price: 1850,
    originalPrice: 2200,
    image: '/products/vitamine-d3.jpg',
    rating: 4.8,
    reviewCount: 124,
    category: 'Vitamines & Compléments',
    inStock: true,
    isOnSale: true,
    description: 'Complément alimentaire à base de vitamine D3 pour le maintien d\'une ossature normale.'
  },
  {
    id: '2',
    name: 'Magnésium Marin B6 - 90 Comprimés',
    brand: 'Arkopharma',
    price: 1650,
    image: '/products/magnesium.jpg',
    rating: 4.5,
    reviewCount: 89,
    category: 'Vitamines & Compléments',
    inStock: true,
    description: 'Magnésium d\'origine marine associé à la vitamine B6 pour réduire la fatigue.'
  },
  {
    id: '3',
    name: 'Omega 3 EPA/DHA - 120 Capsules',
    brand: 'Nutri&Co',
    price: 2450,
    image: '/products/omega3.jpg',
    rating: 4.7,
    reviewCount: 156,
    category: 'Vitamines & Compléments',
    inStock: true,
    description: 'Acides gras essentiels EPA et DHA issus d\'huile de poissons sauvages.'
  },

  // Soins & Beauté
  {
    id: '4',
    name: 'Crème Hydratante Visage SPF 30 - 50ml',
    brand: 'La Roche-Posay',
    price: 2850,
    originalPrice: 3200,
    image: '/products/creme-visage.jpg',
    rating: 4.9,
    reviewCount: 203,
    category: 'Soins & Beauté',
    inStock: true,
    isOnSale: true,
    description: 'Crème hydratante quotidienne avec protection solaire pour tous types de peau.'
  },
  {
    id: '5',
    name: 'Gel Nettoyant Purifiant - 200ml',
    brand: 'Avène',
    price: 1950,
    image: '/products/gel-nettoyant.jpg',
    rating: 4.6,
    reviewCount: 142,
    category: 'Soins & Beauté',
    inStock: true,
    description: 'Gel nettoyant doux pour peaux sensibles et mixtes, sans savon.'
  },
  {
    id: '6',
    name: 'Sérum Anti-Âge Vitamine C - 30ml',
    brand: 'Vichy',
    price: 3450,
    image: '/products/serum-vitamine-c.jpg',
    rating: 4.8,
    reviewCount: 198,
    category: 'Soins & Beauté',
    inStock: false,
    description: 'Sérum concentré en vitamine C pour un teint éclatant et unifié.'
  },

  // Bébé & Enfant
  {
    id: '7',
    name: 'Lait Infantile 1er Âge - 800g',
    brand: 'Guigoz',
    price: 1750,
    image: '/products/lait-infantile.jpg',
    rating: 4.4,
    reviewCount: 67,
    category: 'Bébé & Enfant',
    inStock: true,
    description: 'Lait infantile 1er âge pour nourrissons de 0 à 6 mois.'
  },
  {
    id: '8',
    name: 'Lingettes Bébé Ultra Douces - Pack de 12',
    brand: 'Pampers',
    price: 2200,
    originalPrice: 2500,
    image: '/products/lingettes-bebe.jpg',
    rating: 4.7,
    reviewCount: 89,
    category: 'Bébé & Enfant',
    inStock: true,
    isOnSale: true,
    description: 'Lingettes ultra douces pour la toilette de bébé, sans alcool ni parfum.'
  },

  // Hygiène Personnelle
  {
    id: '9',
    name: 'Dentifrice Blancheur - 75ml',
    brand: 'Signal',
    price: 450,
    image: '/products/dentifrice.jpg',
    rating: 4.3,
    reviewCount: 234,
    category: 'Hygiène Personnelle',
    inStock: true,
    description: 'Dentifrice pour des dents plus blanches et une haleine fraîche.'
  },
  {
    id: '10',
    name: 'Déodorant Anti-Transpirant 48h - 50ml',
    brand: 'Rexona',
    price: 650,
    image: '/products/deodorant.jpg',
    rating: 4.5,
    reviewCount: 178,
    category: 'Hygiène Personnelle',
    inStock: true,
    description: 'Protection anti-transpirante 48h avec parfum frais.'
  },

  // Minceur & Nutrition
  {
    id: '11',
    name: 'Brûleur de Graisses - 60 Gélules',
    brand: 'Juvamine',
    price: 1550,
    originalPrice: 1800,
    image: '/products/bruleur-graisses.jpg',
    rating: 4.2,
    reviewCount: 95,
    category: 'Minceur & Nutrition',
    inStock: true,
    isOnSale: true,
    description: 'Complément alimentaire pour favoriser la perte de poids et brûler les graisses.'
  },
  {
    id: '12',
    name: 'Protéines Whey Vanille - 750g',
    brand: 'Optimum Nutrition',
    price: 3850,
    image: '/products/proteine-whey.jpg',
    rating: 4.8,
    reviewCount: 267,
    category: 'Minceur & Nutrition',
    inStock: true,
    description: 'Protéines en poudre pour développer et maintenir la masse musculaire.'
  }
];

export const categories = [
  'Vitamines & Compléments',
  'Soins & Beauté',
  'Bébé & Enfant',
  'Hygiène Personnelle',
  'Minceur & Nutrition',
  'Douleurs & Fièvre',
  'Premiers Secours',
  'Orthopédie'
];

export const brands = [
  'Solgar',
  'Arkopharma',
  'Nutri&Co',
  'La Roche-Posay',
  'Avène',
  'Vichy',
  'Guigoz',
  'Pampers',
  'Signal',
  'Rexona',
  'Juvamine',
  'Optimum Nutrition'
];

export function getProductsByCategory(category: string): Product[] {
  return sampleProducts.filter(product => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return sampleProducts.find(product => product.id === id);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return sampleProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
}