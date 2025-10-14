'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash2, Tag, ExternalLink, Upload } from 'lucide-react';
import AddBrandModal from '@/components/dashboard/AddBrandModal';
import EditBrandModal from '@/components/dashboard/EditBrandModal';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  _count: {
    products: number;
  };
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBrand = () => {
    setIsAddModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsEditModalOpen(true);
  };

  const handleDeleteBrand = async (brand: Brand) => {
    if (brand._count.products > 0) {
      alert('Impossible de supprimer une marque contenant des produits');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer la marque "${brand.name}" ?`)) {
      try {
        const response = await fetch(`/api/brands/${brand.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchBrands();
        } else {
          const data = await response.json();
          alert(data.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedBrand(null);
  };

  const handleSuccess = () => {
    fetchBrands();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
      return;
    }

    try {
      setIsImporting(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/brands/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const message = `Import terminé avec succès!\n\n` +
          `✓ Importées: ${data.imported}\n` +
          `✓ Mises à jour: ${data.updated}\n` +
          `✗ Ignorées: ${data.skipped}` +
          (data.errors && data.errors.length > 0 ? `\n\nErreurs:\n${data.errors.join('\n')}` : '');

        alert(message);
        fetchBrands();
      } else {
        alert(data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      console.error('Error importing brands:', error);
      alert('Erreur lors de l\'import du fichier');
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#6B7280' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Modals */}
      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
      {selectedBrand && (
        <EditBrandModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          brand={selectedBrand}
          onSuccess={handleSuccess}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              Gestion des Marques
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
              {brands.length} marques au total
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Import Button */}
            <button
              onClick={handleImportClick}
              disabled={isImporting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: isImporting ? '#9CA3AF' : 'white',
                color: isImporting ? 'white' : '#7ED321',
                border: '2px solid #7ED321',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: isImporting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isImporting) {
                  e.currentTarget.style.backgroundColor = '#F0FDE4';
                }
              }}
              onMouseLeave={(e) => {
                if (!isImporting) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <Upload style={{ width: '1.25rem', height: '1.25rem' }} />
              {isImporting ? 'Import en cours...' : 'Importer Excel'}
            </button>

            {/* Add Brand Button */}
            <button
              onClick={handleAddBrand}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(126, 211, 33, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(126, 211, 33, 0.3)';
              }}
            >
              <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
              Nouvelle Marque
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '500px' }}>
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
            placeholder="Rechercher une marque..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
      </div>

      {/* Brands Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredBrands.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '3rem',
              textAlign: 'center',
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
            }}
          >
            <Tag style={{ width: '48px', height: '48px', color: '#9CA3AF', margin: '0 auto 1rem' }} />
            <p style={{ color: '#9CA3AF', fontSize: '1rem' }}>
              Aucune marque trouvée
            </p>
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <div
              key={brand.id}
              style={{
                background: 'white',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Logo and Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'contain',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB',
                      padding: '0.5rem',
                      background: 'white',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                    }}
                  >
                    {brand.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.25rem' }}>
                    {brand.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {brand._count.products} produit{brand._count.products !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Website */}
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#3B82F6',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ExternalLink style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  {brand.website}
                </a>
              )}

              {/* Status and Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #F3F4F6',
                  marginTop: 'auto',
                }}
              >
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: brand.isActive ? '#D1FAE5' : '#F3F4F6',
                    color: brand.isActive ? '#065F46' : '#6B7280',
                  }}
                >
                  {brand.isActive ? 'Active' : 'Inactive'}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEditBrand(brand)}
                    style={{
                      padding: '0.5rem',
                      background: '#F3F4F6',
                      color: '#4A4A4A',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand)}
                    disabled={brand._count.products > 0}
                    style={{
                      padding: '0.5rem',
                      background: brand._count.products > 0 ? '#F3F4F6' : '#FEE2E2',
                      color: brand._count.products > 0 ? '#9CA3AF' : '#DC2626',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: brand._count.products > 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: brand._count.products > 0 ? 0.5 : 1,
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
