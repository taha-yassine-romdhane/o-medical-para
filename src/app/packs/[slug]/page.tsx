'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Minus, Plus, Package, Truck, Shield, ArrowLeft, Tag, TrendingDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface PackItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    reference: string;
    price: number;
    promoPrice: number | null;
    brand: { name: string } | null;
    images: { url: string }[];
    inStock: boolean;
    stockQuantity: number;
  };
}

interface Pack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  packPrice: number;
  totalPrice: number;
  isActive: boolean;
  isFeatured: boolean;
  items: PackItem[];
}

export default function PackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [pack, setPack] = useState<Pack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [packQuantity, setPackQuantity] = useState(1);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/packs?slug=${slug}`);
        const data = await response.json();

        if (response.ok && data.packs && data.packs.length > 0) {
          setPack(data.packs[0]);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching pack:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPack();
    }
  }, [slug]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = packQuantity + delta;
    if (newQuantity >= 1) {
      setPackQuantity(newQuantity);
    }
  };

  const handleAddPackToCart = () => {
    if (!pack) return;

    // Calculate the discount ratio to apply to each product
    const discountRatio = pack.packPrice / pack.totalPrice;

    // Generate a unique pack instance ID
    const packInstanceId = `pack_${pack.id}_${Date.now()}`;

    // Add each product from the pack to cart with proportional pack discount
    pack.items.forEach((item) => {
      const totalQuantity = item.quantity * packQuantity;
      const originalPrice = item.product.promoPrice || item.product.price;
      // Apply pack discount proportionally to this product
      const packDiscountedPrice = originalPrice * discountRatio;

      addToCart({
        id: item.product.id,
        productId: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        promoPrice: packDiscountedPrice,
        image: item.product.images[0]?.url || '',
        brand: item.product.brand?.name || null,
        inStock: item.product.inStock,
        stockQuantity: item.product.stockQuantity,
        packId: packInstanceId,
        packName: pack.name,
      }, totalQuantity);
    });
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <Package className="h-12 w-12 mx-auto mb-4" style={{ color: '#7ED321' }} />
          <div style={{ fontSize: '1.125rem', fontWeight: '500' }}>Chargement du pack...</div>
        </div>
      </div>
    );
  }

  if (notFound || !pack) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Pack non trouvé
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            Le pack que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            href="/packs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#7ED321',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6AB81E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#7ED321';
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            Retour aux packs
          </Link>
        </div>
      </div>
    );
  }

  const savings = pack.totalPrice - pack.packPrice;
  const savingsPercent = ((savings / pack.totalPrice) * 100).toFixed(0);

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>
              Accueil
            </Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <Link href="/packs" style={{ color: '#6B7280', textDecoration: 'none' }}>
              Packs
            </Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#1F2937', fontWeight: '500' }}>{pack.name}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Pack Image */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ position: 'relative', paddingBottom: '100%', backgroundColor: '#F3F4F6', borderRadius: '0.5rem', overflow: 'hidden' }}>
                {pack.image ? (
                  <Image
                    src={pack.image}
                    alt={pack.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={pack.image.startsWith('http')}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Package style={{ width: '6rem', height: '6rem', color: '#D1D5DB' }} />
                  </div>
                )}

                {/* Savings Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  -{savingsPercent}%
                </div>
              </div>
            </div>

            {/* Pack Info */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
                {pack.name}
              </h1>

              {pack.description && (
                <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {pack.description}
                </p>
              )}

              {/* Pricing Info */}
              <div style={{
                backgroundColor: 'rgba(126, 211, 33, 0.1)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1rem', color: '#6B7280' }}>Prix normal:</span>
                  <span style={{ fontSize: '1.25rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                    {pack.totalPrice.toFixed(2)} TND
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>Prix du pack:</span>
                  <span style={{ fontSize: '2rem', fontWeight: '700', color: '#7ED321' }}>
                    {pack.packPrice.toFixed(2)} TND
                  </span>
                </div>
                <div style={{
                  borderTop: '1px solid rgba(126, 211, 33, 0.2)',
                  paddingTop: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <TrendingDown style={{ width: '1.25rem', height: '1.25rem', color: '#7ED321' }} />
                    <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F4D1A' }}>
                      Vous économisez {savings.toFixed(2)} TND
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                  Quantité
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={packQuantity <= 1}
                    style={{
                      padding: '0.5rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      cursor: packQuantity <= 1 ? 'not-allowed' : 'pointer',
                      opacity: packQuantity <= 1 ? 0.5 : 1
                    }}
                  >
                    <Minus style={{ width: '1.25rem', height: '1.25rem', color: '#1F2937' }} />
                  </button>
                  <span style={{ fontSize: '1.25rem', fontWeight: '600', minWidth: '3rem', textAlign: 'center' }}>
                    {packQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    style={{
                      padding: '0.5rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus style={{ width: '1.25rem', height: '1.25rem', color: '#1F2937' }} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddPackToCart}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#7ED321',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  marginBottom: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#6AB81E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#7ED321';
                }}
              >
                <ShoppingCart style={{ width: '1.5rem', height: '1.5rem' }} />
                Ajouter au panier
              </button>

              {/* Benefits */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <Truck style={{ width: '2rem', height: '2rem', color: '#7ED321', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Livraison rapide</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Shield style={{ width: '2rem', height: '2rem', color: '#7ED321', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Paiement sécurisé</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Tag style={{ width: '2rem', height: '2rem', color: '#7ED321', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Meilleur prix</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pack Products */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
            Produits inclus dans ce pack
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pack.items.map((item) => {
              const productPrice = item.product.promoPrice || item.product.price;
              const productImage = item.product.images[0]?.url || '';

              return (
                <Link
                  key={item.id}
                  href={`/produits/${item.product.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '0.75rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {productImage ? (
                      <Image
                        src={productImage}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized={productImage.startsWith('http')}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Package style={{ width: '2rem', height: '2rem', color: '#D1D5DB' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                      {item.product.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                      {item.product.reference}
                      {item.product.brand && ` • ${item.product.brand.name}`}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: '#7ED321' }}>
                        {productPrice.toFixed(2)} TND
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        × {item.quantity}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
