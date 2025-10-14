'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import ImageUpload from '@/components/dashboard/ImageUpload';

interface HeroSlider {
  id: string;
  image: string;
  url: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function SlidersPage() {
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
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/hero-sliders');
      const data = await res.json();
      if (data.sliders) {
        setSliders(data.sliders);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setIsLoading(false);
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
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchSliders();
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
        fetchSliders();
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
    }
  };

  const openModal = (slider?: HeroSlider) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        image: slider.image,
        url: slider.url || '',
        isActive: slider.isActive,
      });
    } else {
      setEditingSlider(null);
      setFormData({
        image: '',
        url: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlider(null);
    setFormData({
      image: '',
      url: '',
      isActive: true,
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
            Hero Sliders
          </h1>
          <p style={{ color: '#6B7280' }}>
            Gérez les images du slider principal de la page d'accueil
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
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
          Ajouter un Slider
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
          Chargement...
        </div>
      ) : sliders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '2px dashed #E5E7EB',
          }}
        >
          <ImageIcon style={{ width: '4rem', height: '4rem', color: '#9CA3AF', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
            Aucun slider
          </h3>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            Commencez par ajouter votre premier slider
          </p>
          <button
            onClick={() => openModal()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Ajouter un Slider
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {sliders.map((slider) => (
            <div
              key={slider.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#F3F4F6' }}>
                {slider.image ? (
                  <Image
                    src={slider.image}
                    alt="Slider"
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={slider.image.startsWith('http')}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ImageIcon style={{ width: '3rem', height: '3rem', color: '#9CA3AF' }} />
                  </div>
                )}

                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: slider.isActive ? '#7ED321' : '#9CA3AF',
                    color: 'white',
                  }}
                >
                  {slider.isActive ? 'Actif' : 'Inactif'}
                </div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                {slider.url && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6B7280',
                    }}
                  >
                    <ExternalLink style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {slider.url}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => openModal(slider)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#F3F4F6',
                      color: '#4A4A4A',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Edit2 style={{ width: '1rem', height: '1rem' }} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <>
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '600px',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
                  {editingSlider ? 'Modifier le Slider' : 'Ajouter un Slider'}
                </h2>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    label="Image du slider *"
                  />
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>
                    Recommandé: 1920x500px pour une meilleure qualité
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    URL de redirection (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="/produits ou https://example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Slider actif
                    </span>
                  </label>
                </div>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#F3F4F6',
                    color: '#4A4A4A',
                    border: 'none',
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
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {editingSlider ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
