'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AddFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  onSuccess?: () => void;
}

export default function AddFamilyModal({
  isOpen,
  onClose,
  categoryId,
  categoryName,
  onSuccess,
}: AddFamilyModalProps) {
  const [formData, setFormData] = useState({
    reference: '',
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categoryId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue');
        setIsLoading(false);
        return;
      }

      setFormData({ name: '', description: '' });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError('Une erreur est survenue lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ reference: '', name: '', description: '' });
      setError('');
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
              Ajouter une Famille
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
              Dans la catégorie: {categoryName}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            style={{
              padding: '0.5rem',
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <X className="h-5 w-5" style={{ color: '#4A4A4A' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div
                style={{
                  padding: '1rem',
                  background: '#FEE2E2',
                  borderRadius: '0.5rem',
                  border: '1px solid #EF4444',
                }}
              >
                <p style={{ fontSize: '0.875rem', color: '#991B1B' }}>{error}</p>
              </div>
            )}

            {/* Reference */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                Référence <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.9375rem',
                  color: '#1F2937',
                  opacity: isLoading ? 0.5 : 1,
                }}
                placeholder="Ex: FAM-001 ou 00001"
              />
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Cette référence sera utilisée pour l'import des produits depuis Excel
              </p>
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                Nom de la famille <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.9375rem',
                  color: '#1F2937',
                  opacity: isLoading ? 0.5 : 1,
                }}
                placeholder="Ex: Vitamines A-Z"
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                Description (Optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.9375rem',
                  color: '#1F2937',
                  resize: 'vertical',
                  opacity: isLoading ? 0.5 : 1,
                }}
                placeholder="Description de la famille..."
              />
            </div>
          </div>

          {/* Footer */}
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
              onClick={handleClose}
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#F3F4F6',
                color: '#4A4A4A',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: isLoading
                  ? '#9CA3AF'
                  : 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Création...' : 'Créer la Famille'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}