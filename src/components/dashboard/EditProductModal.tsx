'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  families: Family[];
}

interface Family {
  id: string;
  reference: string;
  name: string;
  subfamilies: Subfamily[];
}

interface Subfamily {
  id: string;
  reference: string;
  name: string;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface Product {
  id: string;
  reference: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  priceHT?: number;
  promoPrice?: number;
  promoPercentage?: number;
  isOnPromo: boolean;
  stockQuantity: number;
  lowStockAlert: number;
  isActive: boolean;
  isFeatured: boolean;
  brand?: Brand;
  category?: Category;
  family?: Family;
  subfamily?: Subfamily;
  images?: ProductImage[];
  brandId?: string;
  categoryId?: string;
  familyId?: string;
  subfamilyId?: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess: () => void;
}

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug || '',
    description: product.description || '',
    price: product.price.toString(),
    priceHT: product.priceHT?.toString() || '',
    promoPercentage: product.promoPercentage?.toString() || '',
    isOnPromo: product.isOnPromo,
    stockQuantity: product.stockQuantity.toString(),
    lowStockAlert: product.lowStockAlert.toString(),
    image: '',
    brandId: product.brandId || '',
    categoryId: product.categoryId || '',
    familyId: product.familyId || '',
    subfamilyId: product.subfamilyId || '',
    isActive: product.isActive,
    isFeatured: product.isFeatured,
  });
  const [autoSlug, setAutoSlug] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableFamilies, setAvailableFamilies] = useState<Family[]>([]);
  const [availableSubfamilies, setAvailableSubfamilies] = useState<Subfamily[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
      fetchCategories();

      // Set initial image preview from product
      const primaryImage = product.images?.find(img => img.isPrimary);
      if (primaryImage) {
        setImagePreview(primaryImage.url);
      }
    }
  }, [isOpen, product]);

  // Auto-generate slug from name
  useEffect(() => {
    if (autoSlug && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, autoSlug]);

  // Auto-calculate priceHT from price (assuming 19% tax)
  useEffect(() => {
    if (formData.price) {
      const priceHT = (parseFloat(formData.price) / 1.19).toFixed(2);
      setFormData(prev => ({ ...prev, priceHT }));
    }
  }, [formData.price]);

  useEffect(() => {
    if (formData.categoryId && categories.length > 0) {
      const category = categories.find(c => c.id === formData.categoryId);
      setAvailableFamilies(category?.families || []);
    }
  }, [formData.categoryId, categories]);

  useEffect(() => {
    if (formData.familyId && availableFamilies.length > 0) {
      const family = availableFamilies.find(f => f.id === formData.familyId);
      setAvailableSubfamilies(family?.subfamilies || []);
    }
  }, [formData.familyId, availableFamilies]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?include=families');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          priceHT: formData.priceHT ? parseFloat(formData.priceHT) : undefined,
          promoPercentage: formData.promoPercentage ? parseInt(formData.promoPercentage) : undefined,
          stockQuantity: parseInt(formData.stockQuantity),
          lowStockAlert: parseInt(formData.lowStockAlert),
          brandId: formData.brandId || null,
          categoryId: formData.categoryId || null,
          familyId: formData.familyId || null,
          subfamilyId: formData.subfamilyId || null,
          image: formData.image || undefined,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de la mise à jour du produit');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Erreur lors de la mise à jour du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
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
              Modifier le produit
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
              Référence: {product.reference}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Slug */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Slug</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6B7280', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={autoSlug}
                    onChange={(e) => setAutoSlug(e.target.checked)}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  Auto
                </label>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  background: autoSlug ? '#F9FAFB' : 'white',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Price TTC */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Prix TTC (TND) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Price HT */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Prix HT (TND)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.priceHT}
                onChange={(e) => setFormData({ ...formData, priceHT: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  background: '#F9FAFB',
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Calculé automatiquement (TVA 19%)
              </p>
            </div>

            {/* Promo Percentage */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Pourcentage promo (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.promoPercentage}
                onChange={(e) => setFormData({ ...formData, promoPercentage: e.target.value })}
                disabled={!formData.isOnPromo}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  opacity: formData.isOnPromo ? 1 : 0.5,
                }}
              />
            </div>

            {/* Is On Promo */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isOnPromo}
                  onChange={(e) => setFormData({ ...formData, isOnPromo: e.target.checked })}
                  style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Activer la promotion
                </span>
              </label>
              {formData.isOnPromo && formData.price && formData.promoPercentage && (
                <p style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '0.5rem' }}>
                  Prix promo: {(parseFloat(formData.price) * (1 - parseInt(formData.promoPercentage) / 100)).toFixed(2)} TND
                </p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Quantité en stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Low Stock Alert */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Alerte stock bas *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.lowStockAlert}
                onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Brand */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Marque
              </label>
              <select
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <option value="">Aucune marque</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Catégorie
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, familyId: '', subfamilyId: '' })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <option value="">Aucune catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Family */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Famille
              </label>
              <select
                value={formData.familyId}
                onChange={(e) => setFormData({ ...formData, familyId: e.target.value, subfamilyId: '' })}
                disabled={!formData.categoryId}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  opacity: formData.categoryId ? 1 : 0.5,
                }}
              >
                <option value="">Aucune famille</option>
                {availableFamilies.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.reference} - {family.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subfamily */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Sous-famille
              </label>
              <select
                value={formData.subfamilyId}
                onChange={(e) => setFormData({ ...formData, subfamilyId: e.target.value })}
                disabled={!formData.familyId}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  opacity: formData.familyId ? 1 : 0.5,
                }}
              >
                <option value="">Aucune sous-famille</option>
                {availableSubfamilies.map((subfamily) => (
                  <option key={subfamily.id} value={subfamily.id}>
                    {subfamily.reference} - {subfamily.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Image du produit
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB',
                    }}
                  />
                )}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  <Upload className="h-4 w-4" />
                  {imagePreview ? 'Changer l\'image' : 'Choisir une image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Is Active */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Produit actif
                </span>
              </label>
            </div>

            {/* Is Featured */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Produit en vedette
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
