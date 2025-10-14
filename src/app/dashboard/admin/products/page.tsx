'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Image as ImageIcon, Upload, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import AddProductModal from '@/components/dashboard/AddProductModal';
import EditProductModal from '@/components/dashboard/EditProductModal';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Family {
  id: string;
  reference: string;
  name: string;
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
  description?: string;
  price: number;
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
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    brandId: '',
    categoryId: '',
    familyId: '',
    subfamilyId: '',
    isActive: '',
    isFeatured: '',
    isOnPromo: '',
    inStock: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [subfamilies, setSubfamilies] = useState<Subfamily[]>([]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchFamilies();
    fetchSubfamilies();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters, activeSearchQuery]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFamilies = async () => {
    try {
      const response = await fetch('/api/families');
      if (response.ok) {
        const data = await response.json();
        setFamilies(data.families || []);
      }
    } catch (error) {
      console.error('Error fetching families:', error);
    }
  };

  const fetchSubfamilies = async () => {
    try {
      const response = await fetch('/api/subfamilies');
      if (response.ok) {
        const data = await response.json();
        setSubfamilies(data.subfamilies || []);
      }
    } catch (error) {
      console.error('Error fetching subfamilies:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        include: 'images',
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(activeSearchQuery && { search: activeSearchQuery }),
        ...(filters.brandId && { brandId: filters.brandId }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.familyId && { familyId: filters.familyId }),
        ...(filters.subfamilyId && { subfamilyId: filters.subfamilyId }),
        ...(filters.isActive && { isActive: filters.isActive }),
        ...(filters.isFeatured && { isFeatured: filters.isFeatured }),
        ...(filters.isOnPromo && { isOnPromo: filters.isOnPromo }),
        ...(filters.inStock && { inStock: filters.inStock }),
      });

      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when searching
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when filters change
  };

  const clearFilters = () => {
    setFilters({
      brandId: '',
      categoryId: '',
      familyId: '',
      subfamilyId: '',
      isActive: '',
      isFeatured: '',
      isOnPromo: '',
      inStock: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        const response = await fetch(`/api/products/${product.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProducts();
        } else {
          const data = await response.json();
          alert(data.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSuccess = () => {
    fetchProducts();
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

    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        let message = `Import terminé!\n\n` +
          `✓ ${data.imported} produits importés\n` +
          `✓ ${data.updated} produits mis à jour\n` +
          `${data.skipped > 0 ? `⚠ ${data.skipped} produits ignorés\n` : ''}`;

        if (data.errors && data.errors.length > 0) {
          message += `\nPremières erreurs:\n${data.errors.slice(0, 5).join('\n')}`;
          if (data.totalErrors > 5) {
            message += `\n... et ${data.totalErrors - 5} autres erreurs`;
          }
        }

        alert(message);
        fetchProducts();
      } else {
        alert(`Erreur lors de l'import: ${data.error}`);
      }
    } catch (error) {
      console.error('Error importing products:', error);
      alert('Erreur lors de l\'import des produits');
    } finally {
      setIsImporting(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExportClick = async () => {
    setIsExporting(true);

    try {
      const response = await fetch('/api/products/export');

      if (response.ok) {
        // Get the blob from response
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `products_export_${new Date().toISOString().split('T')[0]}.xlsx`;

        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        alert(`Erreur lors de l'export: ${data.error}`);
      }
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('Erreur lors de l\'export des produits');
    } finally {
      setIsExporting(false);
    }
  };

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
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          product={selectedProduct}
          onSuccess={handleSuccess}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              Gestion des Produits
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
              {pagination.total} produits au total
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              onClick={handleExportClick}
              disabled={isExporting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: isExporting ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                boxShadow: isExporting ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.3)',
                opacity: isExporting ? 0.6 : 1,
              }}
            >
              <Download className="h-5 w-5" />
              {isExporting ? 'Export en cours...' : 'Exporter Excel'}
            </button>
            <button
              onClick={handleImportClick}
              disabled={isImporting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: isImporting ? '#9CA3AF' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: isImporting ? 'not-allowed' : 'pointer',
                boxShadow: isImporting ? 'none' : '0 2px 8px rgba(59, 130, 246, 0.3)',
                opacity: isImporting ? 0.6 : 1,
              }}
            >
              <Upload className="h-5 w-5" />
              {isImporting ? 'Import en cours...' : 'Importer Excel'}
            </button>
            <button
              onClick={handleAddProduct}
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
            >
              <Plus className="h-5 w-5" />
              Nouveau Produit
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', gap: '0.5rem' }}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
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
              onClick={handleSearch}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.875rem 1.5rem',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              Rechercher
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              background: showFilters ? 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)' : 'white',
              color: showFilters ? 'white' : '#4A4A4A',
              border: showFilters ? 'none' : '2px solid #E5E7EB',
              borderRadius: '0.75rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Filter className="h-5 w-5" />
            Filtres
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1.5rem',
              background: 'white',
              borderRadius: '0.75rem',
              border: '2px solid #E5E7EB',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {/* Brand Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Marque
                </label>
                <select
                  value={filters.brandId}
                  onChange={(e) => handleFilterChange('brandId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  <option value="">Toutes les marques</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Catégorie
                </label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Family Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Famille
                </label>
                <select
                  value={filters.familyId}
                  onChange={(e) => handleFilterChange('familyId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  <option value="">Toutes les familles</option>
                  {families.map(family => (
                    <option key={family.id} value={family.id}>{family.name}</option>
                  ))}
                </select>
              </div>

              {/* Subfamily Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Sous-famille
                </label>
                <select
                  value={filters.subfamilyId}
                  onChange={(e) => handleFilterChange('subfamilyId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  <option value="">Toutes les sous-familles</option>
                  {subfamilies.map(subfamily => (
                    <option key={subfamily.id} value={subfamily.id}>{subfamily.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Statut
                </label>
                <select
                  value={filters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  <option value="">Tous les statuts</option>
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>

              {/* Promo Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Promotion
                </label>
                <select
                  value={filters.isOnPromo}
                  onChange={(e) => handleFilterChange('isOnPromo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  <option value="">Tous</option>
                  <option value="true">En promotion</option>
                  <option value="false">Prix normal</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Stock
                </label>
                <select
                  value={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  <option value="">Tous</option>
                  <option value="true">En stock</option>
                  <option value="false">Rupture</option>
                </select>
              </div>

              {/* Featured Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                  Vedette
                </label>
                <select
                  value={filters.isFeatured}
                  onChange={(e) => handleFilterChange('isFeatured', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  <option value="">Tous</option>
                  <option value="true">Produit vedette</option>
                  <option value="false">Normal</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={clearFilters}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: '#F3F4F6',
                  color: '#4A4A4A',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
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
                Image
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Référence
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Produit
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Marque
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Famille
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Sous-famille
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
                <td colSpan={10} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary);
                const displayPrice = product.isOnPromo && product.promoPrice ? product.promoPrice : product.price;

                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '1rem' }}>
                      {primaryImage ? (
                        <img
                          src={primaryImage.url}
                          alt={product.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '0.5rem',
                            border: '1px solid #E5E7EB',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            background: '#F3F4F6',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ImageIcon style={{ width: '24px', height: '24px', color: '#9CA3AF' }} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: '#7ED321',
                          padding: '0.25rem 0.5rem',
                          background: 'rgba(126, 211, 33, 0.1)',
                          borderRadius: '0.25rem',
                        }}
                      >
                        {product.reference}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.9375rem' }}>
                          {product.name}
                        </p>
                        {product.description && (
                          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.125rem' }}>
                            {product.description.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {product.brand?.name || '-'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {product.family?.name || '-'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {product.subfamily?.name || '-'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        {product.isOnPromo ? (
                          <>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#DC2626' }}>
                              {displayPrice.toFixed(2)} TND
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                              {product.price.toFixed(2)} TND
                            </p>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#DC2626',
                                background: '#FEE2E2',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '0.25rem',
                              }}
                            >
                              -{product.promoPercentage}%
                            </span>
                          </>
                        ) : (
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                            {displayPrice.toFixed(2)} TND
                          </p>
                        )}
                      </div>
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
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEditProduct(product)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: '#F3F4F6',
                            color: '#4A4A4A',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Page Info */}
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Affichage de {(pagination.page - 1) * pagination.limit + 1} à{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} produits
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              style={{
                padding: '0.5rem 0.75rem',
                background: pagination.page === 1 ? '#F3F4F6' : 'white',
                color: pagination.page === 1 ? '#9CA3AF' : '#4A4A4A',
                border: '2px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>

            {/* Page Numbers */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    Math.abs(pageNum - pagination.page) <= 1
                  );
                })
                .map((pageNum, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore = index > 0 && pageNum - array[index - 1] > 1;

                  return (
                    <div key={pageNum} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      {showEllipsisBefore && (
                        <span style={{ padding: '0 0.5rem', color: '#9CA3AF' }}>...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: pagination.page === pageNum
                            ? 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)'
                            : 'white',
                          color: pagination.page === pageNum ? 'white' : '#4A4A4A',
                          border: pagination.page === pageNum ? 'none' : '2px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          minWidth: '2.5rem',
                        }}
                      >
                        {pageNum}
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              style={{
                padding: '0.5rem 0.75rem',
                background: pagination.page === pagination.totalPages ? '#F3F4F6' : 'white',
                color: pagination.page === pagination.totalPages ? '#9CA3AF' : '#4A4A4A',
                border: '2px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
