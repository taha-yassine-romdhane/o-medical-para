'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Eye, EyeOff, X, Search } from 'lucide-react';
import Image from 'next/image';
import ImageUpload from '@/components/dashboard/ImageUpload';

interface Product {
  id: string;
  name: string;
  slug: string;
  reference: string;
  price: number;
  promoPrice: number | null;
  images: { url: string }[];
  brand: { name: string } | null;
}

interface PackItem {
  productId: string;
  quantity: number;
  product: Product;
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
  sortOrder: number;
  items: PackItem[];
}

export default function PacksManagementPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    packPrice: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
  });
  const [selectedProducts, setSelectedProducts] = useState<{ productId: string; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPacks();
    fetchProducts();
  }, []);

  const fetchPacks = async () => {
    try {
      const res = await fetch('/api/packs');
      const data = await res.json();
      setPacks(data.packs || []);
    } catch (error) {
      console.error('Error fetching packs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=1000');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      alert('Veuillez sélectionner au moins un produit');
      return;
    }

    try {
      const url = editingPack ? `/api/packs/${editingPack.id}` : '/api/packs';
      const method = editingPack ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: selectedProducts,
        }),
      });

      if (res.ok) {
        await fetchPacks();
        closeModal();
      } else {
        const error = await res.json();
        alert(error.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving pack:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) return;

    try {
      const res = await fetch(`/api/packs/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchPacks();
    } catch (error) {
      console.error('Error deleting pack:', error);
    }
  };

  const openModal = (pack?: Pack) => {
    if (pack) {
      setEditingPack(pack);
      setFormData({
        name: pack.name,
        description: pack.description || '',
        image: pack.image,
        packPrice: pack.packPrice.toString(),
        isActive: pack.isActive,
        isFeatured: pack.isFeatured,
        sortOrder: pack.sortOrder,
      });
      setSelectedProducts(
        pack.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }))
      );
    } else {
      setEditingPack(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        packPrice: '',
        isActive: true,
        isFeatured: false,
        sortOrder: packs.length,
      });
      setSelectedProducts([]);
    }
    setSearchQuery('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPack(null);
    setSelectedProducts([]);
    setSearchQuery('');
  };

  const addProduct = (productId: string) => {
    if (!selectedProducts.find((p) => p.productId === productId)) {
      setSelectedProducts([...selectedProducts, { productId, quantity: 1 }]);
    }
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...selectedProducts];
    updated[index] = { ...updated[index], quantity };
    setSelectedProducts(updated);
  };

  const calculateSavings = (pack: Pack) => {
    return ((pack.totalPrice - pack.packPrice) / pack.totalPrice * 100).toFixed(0);
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      const productPrice = product?.promoPrice || product?.price || 0;
      return sum + productPrice * item.quantity;
    }, 0);
  };

  const calculateEstimatedSavings = () => {
    const total = calculateTotalPrice();
    const packPriceNum = parseFloat(formData.packPrice) || 0;
    if (total > 0 && packPriceNum > 0 && packPriceNum < total) {
      return ((total - packPriceNum) / total * 100).toFixed(0);
    }
    return 0;
  };

  const filteredProducts = products.filter((product) =>
    !selectedProducts.find((p) => p.productId === product.id) &&
    (searchQuery === '' ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
            Gestion des Packs
          </h1>
          <p style={{ color: '#6B7280' }}>Créez des offres groupées de produits avec des prix spéciaux</p>
        </div>
        <button
          onClick={() => openModal()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
          Créer un Pack
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {packs.map((pack) => (
          <div
            key={pack.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              border: '1px solid #E5E7EB',
              padding: '1.5rem',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                backgroundColor: '#F3F4F6',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {pack.image && pack.image.trim() !== '' ? (
                <Image
                  src={pack.image}
                  alt={pack.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized={pack.image.startsWith('http')}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package style={{ width: '4rem', height: '4rem', color: '#9CA3AF' }} />
                </div>
              )}
              {!pack.isActive && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EyeOff style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                }}
              >
                -{calculateSavings(pack)}%
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937' }}>{pack.name}</h3>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: pack.isActive ? '#D1FAE5' : '#FEE2E2',
                    color: pack.isActive ? '#065F46' : '#991B1B',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {pack.isActive ? 'Actif' : 'Inactif'}
                </span>
                {pack.isFeatured && (
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    Mis en avant
                  </span>
                )}
              </div>

              {pack.description && (
                <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{pack.description}</p>
              )}

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem' }}>Prix du pack</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7ED321' }}>
                    {pack.packPrice.toFixed(2)} TND
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem' }}>Prix total</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: '#9CA3AF', textDecoration: 'line-through' }}>
                    {pack.totalPrice.toFixed(2)} TND
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem' }}>Économie</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#DC2626' }}>
                    {(pack.totalPrice - pack.packPrice).toFixed(2)} TND
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Produits inclus ({pack.items.length})
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {pack.items.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        color: '#4A4A4A',
                      }}
                    >
                      {item.product.name} x{item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={() => openModal(pack)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#F0FDE4',
                  color: '#7ED321',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <Edit style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
              <button
                onClick={() => handleDelete(pack.id)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <>
          <div onClick={closeModal} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9998 }} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: '1rem',
              width: '95%',
              maxWidth: '1400px',
              maxHeight: '95vh',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 9999,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '2rem',
              borderBottom: '1px solid #E5E7EB',
            }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
                {editingPack ? 'Modifier le Pack' : 'Créer un Pack'}
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Créez une offre groupée de produits avec un prix spécial pour encourager les ventes
              </p>
            </div>

            {/* Modal Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem',
            }}>
              <form onSubmit={handleSubmit} id="pack-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>

                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                        Nom du pack *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Pack Soins Complet"
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#7ED321'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Décrivez les avantages de ce pack..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          resize: 'vertical',
                          outline: 'none',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#7ED321'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                      />
                    </div>

                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                      label="Image du pack *"
                    />

                    {/* Pricing Section */}
                    <div style={{
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      border: '2px dashed #E5E7EB',
                    }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
                        Tarification du Pack
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Prix total des produits:</span>
                          <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937' }}>
                            {calculateTotalPrice().toFixed(2)} TND
                          </span>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                            Prix du pack (TND) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.packPrice}
                            onChange={(e) => setFormData({ ...formData, packPrice: e.target.value })}
                            placeholder="0.00"
                            style={{
                              width: '100%',
                              padding: '0.875rem',
                              border: '2px solid #E5E7EB',
                              borderRadius: '0.5rem',
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              outline: 'none',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#7ED321'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                          />
                        </div>

                        {calculateEstimatedSavings() > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#FEE2E2', borderRadius: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#991B1B' }}>Économie pour le client:</span>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#DC2626' }}>
                                -{calculateEstimatedSavings()}%
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                                {(calculateTotalPrice() - parseFloat(formData.packPrice || '0')).toFixed(2)} TND
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                          Ordre
                        </label>
                        <input
                          type="number"
                          value={formData.sortOrder}
                          onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                          min="0"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #E5E7EB',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                          Statut
                        </label>
                        <select
                          value={formData.isActive ? 'true' : 'false'}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #E5E7EB',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                          }}
                        >
                          <option value="true">Actif</option>
                          <option value="false">Inactif</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                          Mis en avant
                        </label>
                        <select
                          value={formData.isFeatured ? 'true' : 'false'}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === 'true' })}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #E5E7EB',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                          }}
                        >
                          <option value="false">Non</option>
                          <option value="true">Oui</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Product Selection */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                        Produits du pack *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', width: '1.25rem', height: '1.25rem' }} />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher un produit..."
                          style={{
                            width: '100%',
                            padding: '0.875rem 1rem 0.875rem 3rem',
                            border: '2px solid #E5E7EB',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            outline: 'none',
                          }}
                          onFocus={(e) => e.currentTarget.style.borderColor = '#7ED321'}
                          onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                        />
                      </div>
                    </div>

                    {/* Selected Products */}
                    {selectedProducts.length > 0 && (
                      <div style={{
                        backgroundColor: '#F0FDE4',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        border: '2px solid #7ED321',
                      }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.75rem' }}>
                          Produits sélectionnés ({selectedProducts.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {selectedProducts.map((item, index) => {
                            const product = products.find((p) => p.id === item.productId);
                            if (!product) return null;

                            return (
                              <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                border: '1px solid #D1FAE5',
                              }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                                    {product.name}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                    {product.reference} • {(product.promoPrice || product.price).toFixed(2)} TND
                                  </div>
                                </div>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                  style={{
                                    width: '70px',
                                    padding: '0.5rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeProduct(index)}
                                  style={{
                                    padding: '0.5rem',
                                    backgroundColor: '#FEE2E2',
                                    color: '#DC2626',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <X style={{ width: '1rem', height: '1rem' }} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Available Products */}
                    <div style={{
                      flex: 1,
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      overflowY: 'auto',
                      maxHeight: '500px',
                    }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.75rem' }}>
                        Produits disponibles {searchQuery ? `(${filteredProducts.length} résultats)` : `(${filteredProducts.length} produits)`}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => addProduct(product.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                border: '1px solid #E5E7EB',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#F0FDE4';
                                e.currentTarget.style.borderColor = '#7ED321';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                              }}
                            >
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  style={{ borderRadius: '0.375rem', objectFit: 'cover' }}
                                  unoptimized={product.images[0].url.startsWith('http')}
                                />
                              ) : (
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  backgroundColor: '#F3F4F6',
                                  borderRadius: '0.375rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                  <Package style={{ width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                                </div>
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                                  {product.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                  {product.reference} • {(product.promoPrice || product.price).toFixed(2)} TND
                                </div>
                              </div>
                              <Plus style={{ width: '1.25rem', height: '1.25rem', color: '#7ED321' }} />
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                            {searchQuery ? 'Aucun produit trouvé pour cette recherche' : selectedProducts.length === products.length ? 'Tous les produits ont été sélectionnés' : 'Aucun produit disponible'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
            }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#4A4A4A',
                  border: '2px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                form="pack-form"
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(126, 211, 33, 0.3)',
                }}
              >
                {editingPack ? 'Mettre à jour' : 'Créer le pack'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
