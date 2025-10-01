'use client';

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Flame } from "lucide-react";

interface Product {
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

interface PromotionsSectionProps {
  products: Product[];
}

const PromotionsSection = ({ products }: PromotionsSectionProps) => {
  const onSaleProducts = products.filter(product => product.isOnSale);

  if (onSaleProducts.length === 0) {
    return null;
  }

  return (
    <section
      className="py-12"
      style={{
        background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.03) 0%, rgba(156, 163, 175, 0.05) 100%)',
        paddingTop: '3rem',
        paddingBottom: '3rem'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          className="flex justify-between items-center mb-8"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}
        >
          <div>
            <h2
              className="text-3xl font-bold mb-2 flex items-center"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: '700',
                color: '#1F2937',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  boxShadow: '0 4px 12px rgba(126, 211, 33, 0.3)'
                }}
              >
                <Flame
                  className="h-6 w-6"
                  style={{
                    color: 'white',
                    width: '1.5rem',
                    height: '1.5rem'
                  }}
                />
              </div>
              Promotions Spéciales
            </h2>
            <p
              className="text-base"
              style={{
                fontSize: '1rem',
                color: '#6B7280',
                lineHeight: '1.5',
                fontWeight: '400'
              }}
            >
              Profitez de nos offres exceptionnelles et économisez jusqu&apos;à 50%
            </p>
          </div>
          <Link
            href="/promotions"
            className="font-semibold flex items-center transition-all duration-200"
            style={{
              color: '#1F2937',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              border: '2px solid rgba(126, 211, 33, 0.3)',
              backgroundColor: 'rgba(126, 211, 33, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7ED321';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = '#7ED321';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.1)';
              e.currentTarget.style.color = '#1F2937';
              e.currentTarget.style.borderColor = 'rgba(126, 211, 33, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {onSaleProducts.map((product) => (
            <div
              key={product.id}
              style={{
                transform: 'translateY(0)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;