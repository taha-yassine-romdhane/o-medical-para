'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface HeroSlider {
  id: string;
  image: string;
  url: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function SlidersManagementPage() {
  const [sliders, setSliders] = useState<HeroSlider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<HeroSlider | null>(null);
  const [formData, setFormData] = useState({
    image: '',
    url: '',
    isActive: true,
  });

  useEffect(() => {
    fetchSliders();
    fetchProducts();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/hero-sliders');
      const data = await res.json();
      setSliders(data.sliders || []);
    } catch (error) {
      console.error('Error fetching sliders:', error);
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

    try {
      const url = editingSlider
        ? `/api/hero-sliders/${editingSlider.id}`
        : '/api/hero-sliders';

      const method = editingSlider ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId: formData.productId || null,
        }),
      });

      if (res.ok) {
        await fetchSliders();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving slider:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce slider ?')) return;

    try {
      const res = await fetch(`/api/hero-sliders/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchSliders();
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
    }
  };

  const openModal = (slider?: HeroSlider) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        title: slider.title,
        subtitle: slider.subtitle || '',
        description: slider.description || '',
        image: slider.image,
        ctaText: slider.ctaText || '',
        ctaLink: slider.ctaLink || '',
        sortOrder: slider.sortOrder,
        isActive: slider.isActive,
        productId: slider.productId || '',
      });
    } else {
      setEditingSlider(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        ctaText: '',
        ctaLink: '',
        sortOrder: sliders.length,
        isActive: true,
        productId: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlider(null);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
            Gestion des Sliders
          </h1>
          <p style={{ color: '#6B7280' }}>
            Gérez les images et contenus du slider principal de la page d&apos;accueil
          </p>
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
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
          Ajouter un Slider
        </button>
      </div>

      {/* Sliders List */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {sliders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB'
          }}>
            <ImageIcon style={{ width: '3rem', height: '3rem', color: '#9CA3AF', margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '0.5rem' }}>
              Aucun slider configuré
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
              Commencez par ajouter votre premier slider pour la page d&apos;accueil
            </p>
          </div>
        ) : (
          sliders.map((slider) => (
            <div
              key={slider.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                padding: '1.5rem',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center'
              }}
            >
              {/* Image Preview */}
              <div
                style={{
                  position: 'relative',
                  width: '200px',
                  height: '120px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {slider.image && slider.image.trim() !== '' && (slider.image.startsWith('/') || slider.image.startsWith('http')) ? (
                  <Image
                    src={slider.image}
                    alt={slider.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={slider.image.startsWith('http')}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F3F4F6'
                  }}>
                    <ImageIcon style={{ width: '3rem', height: '3rem', color: '#9CA3AF' }} />
                  </div>
                )}
                {!slider.isActive && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <EyeOff style={{ width: '2rem', height: '2rem', color: 'white' }} />
                  </div>
                )}
              </div>

              {/* Slider Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>
                    {slider.title}
                  </h3>
                  {slider.subtitle && (
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      - {slider.subtitle}
                    </span>
                  )}
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: slider.isActive ? '#D1FAE5' : '#FEE2E2',
                      color: slider.isActive ? '#065F46' : '#991B1B',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {slider.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                  {slider.description || 'Aucune description'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  {slider.ctaText && (
                    <span>
                      <strong>CTA:</strong> {slider.ctaText} → {slider.ctaLink}
                    </span>
                  )}
                  {slider.product && (
                    <span>
                      <strong>Produit:</strong> {slider.product.name}
                    </span>
                  )}
                  <span>
                    <strong>Ordre:</strong> {slider.sortOrder}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => openModal(slider)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#F0FDE4',
                    color: '#7ED321',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7ED321';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F0FDE4';
                    e.currentTarget.style.color = '#7ED321';
                  }}
                >
                  <Edit style={{ width: '1.25rem', height: '1.25rem' }} />
                </button>
                <button
                  onClick={() => handleDelete(slider.id)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DC2626';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                    e.currentTarget.style.color = '#DC2626';
                  }}
                >
                  <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 9999
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
              {editingSlider ? 'Modifier le Slider' : 'Ajouter un Slider'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Image du slider *"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                      Texte du bouton *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      placeholder="Découvrir"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                      Lien du bouton *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      placeholder="/produits"
                      disabled={!!formData.productId}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: formData.productId ? '#F3F4F6' : 'white',
                        cursor: formData.productId ? 'not-allowed' : 'text',
                        opacity: formData.productId ? 0.6 : 1
                      }}
                    />
                    {formData.productId && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '0.25rem'
                      }}>
                        Lien automatique basé sur le produit sélectionné
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                    Produit associé (optionnel)
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => {
                      const selectedProductId = e.target.value;
                      const selectedProduct = products.find(p => p.id === selectedProductId);

                      if (selectedProduct) {
                        // Auto-fill CTA link with product slug
                        setFormData({
                          ...formData,
                          productId: selectedProductId,
                          ctaLink: `/produits/${selectedProduct.slug}`,
                          ctaText: formData.ctaText || 'Voir le produit'
                        });
                      } else {
                        // Clear product link
                        setFormData({
                          ...formData,
                          productId: '',
                          ctaLink: formData.ctaLink.startsWith('/produits/') ? '' : formData.ctaLink
                        });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Aucun produit (lien manuel)</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.reference} - {product.name}
                      </option>
                    ))}
                  </select>
                  {formData.productId && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#7ED321',
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      ✓ Lien automatique: {formData.ctaLink}
                    </p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                      Ordre d&apos;affichage
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                      Statut
                    </label>
                    <select
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="true">Actif</option>
                      <option value="false">Inactif</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      color: '#4A4A4A',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {editingSlider ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
