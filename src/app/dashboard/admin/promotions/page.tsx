import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Search, Filter, Percent } from 'lucide-react';

export default async function PromotionsPage() {
  const session = await auth();

  // Fetch products with promotions (products that have originalPrice set)
  const promotionalProducts = await prisma.product.findMany({
    where: {
      isOnSale: true,
      originalPrice: { not: null },
    },
    include: {
      category: true,
      brand: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const calculateDiscount = (price: number, originalPrice: number | null) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              Gestion des Promotions
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
              {promotionalProducts.length} produits en promotion
            </p>
          </div>
          <Link
            href="/dashboard/admin/products"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
              color: 'white',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9375rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(126, 211, 33, 0.3)',
            }}
          >
            <Plus className="h-5 w-5" />
            Créer une Promotion
          </Link>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                color: '#9CA3AF',
              }}
            />
            <input
              type="text"
              placeholder="Rechercher une promotion..."
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                border: '2px solid #E5E7EB',
                borderRadius: '0.75rem',
                fontSize: '0.9375rem',
                outline: 'none',
                background: 'white',
              }}
            />
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#4A4A4A',
            }}
          >
            <Filter className="h-5 w-5" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Promotions Grid */}
      {promotionalProducts.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            border: '2px dashed #E5E7EB',
          }}
        >
          <Percent style={{ width: '3rem', height: '3rem', color: '#D1D5DB', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#6B7280' }}>
            Aucune promotion active
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
            Créez votre première promotion pour attirer plus de clients
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {promotionalProducts.map((product) => {
            const discount = calculateDiscount(product.price, product.originalPrice);
            return (
              <div
                key={product.id}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {/* Discount Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: 'white',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                    zIndex: 1,
                  }}
                >
                  -{discount}%
                </div>

                {/* Product Info */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {product.category?.name || 'Non catégorisé'}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7ED321' }}>
                      {product.price.toFixed(2)} TND
                    </span>
                    {product.originalPrice && (
                      <span
                        style={{
                          fontSize: '1rem',
                          color: '#9CA3AF',
                          textDecoration: 'line-through',
                        }}
                      >
                        {product.originalPrice.toFixed(2)} TND
                      </span>
                    )}
                  </div>

                  {/* Savings */}
                  {product.originalPrice && (
                    <div
                      style={{
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.1) 0%, rgba(107, 184, 30, 0.1) 100%)',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                        Économie: {(product.originalPrice - product.price).toFixed(2)} TND
                      </p>
                    </div>
                  )}

                  {/* Stock Info */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid #F3F4F6',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      Stock: {product.stockQuantity}
                    </span>
                    <Link
                      href={`/dashboard/admin/products/${product.id}`}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#F3F4F6',
                        color: '#4A4A4A',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                      }}
                    >
                      Modifier
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid #3B82F6',
          borderRadius: '0.75rem',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
          💡 Astuce
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#4A4A4A', lineHeight: '1.6' }}>
          Pour créer une promotion, modifiez un produit et définissez un prix original plus élevé que le prix actuel.
          Le système calculera automatiquement le pourcentage de réduction.
        </p>
      </div>
    </div>
  );
}