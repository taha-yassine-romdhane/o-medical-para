'use client';

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, TrendingUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  reference: string;
  price: number;
  promoPrice: number | null;
  isOnPromo?: boolean;
  inStock: boolean;
  stockQuantity: number;
  brand: { name: string } | null;
  images: { url: string }[];
}

interface FeaturedProductsSectionProps {
  products: Product[];
}

const FeaturedProductsSection = ({ products }: FeaturedProductsSectionProps) => {
  return (
    <section
      className="py-12"
      style={{
        background: '#FFFFFF',
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
                <TrendingUp
                  className="h-6 w-6"
                  style={{
                    color: 'white',
                    width: '1.5rem',
                    height: '1.5rem'
                  }}
                />
              </div>
              Produits Populaires
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
              Nos meilleures ventes et coups de cœur
            </p>
          </div>
          <Link
            href="/produits"
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
            <span style={{ whiteSpace: 'nowrap' }}>Voir tout</span> <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="lg:hover:-translate-y-1 transition-transform duration-200"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;