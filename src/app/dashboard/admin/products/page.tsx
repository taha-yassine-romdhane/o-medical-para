import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';

export default async function ProductsPage() {
  const session = await auth();

  // Fetch products
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              Gestion des Produits
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
              {products.length} produits au total
            </p>
          </div>
          <Link
            href="/dashboard/admin/products/new"
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
            Nouveau Produit
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
              placeholder="Rechercher un produit..."
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

      {/* Products Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Produit
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Catégorie
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Prix
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Stock
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Statut
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.9375rem' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.125rem' }}>
                        {product.sku || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                    {product.category?.name || 'Non catégorisé'}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                    {product.price.toFixed(2)} TND
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        background: product.stockQuantity > product.lowStockAlert ? '#D1FAE5' : '#FEE2E2',
                        color: product.stockQuantity > product.lowStockAlert ? '#065F46' : '#991B1B',
                      }}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        background: product.isActive ? '#D1FAE5' : '#F3F4F6',
                        color: product.isActive ? '#065F46' : '#6B7280',
                      }}
                    >
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
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
                      }}
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}