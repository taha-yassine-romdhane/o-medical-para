'use client';

import { useState, useEffect } from 'react';
import { Plus, FolderTree, ChevronRight, ChevronDown, Edit, Trash2, Upload, Download, List, Network } from 'lucide-react';
import AddFamilyModal from '@/components/dashboard/AddFamilyModal';
import EditFamilyModal from '@/components/dashboard/EditFamilyModal';
import AddSubfamilyModal from '@/components/dashboard/AddSubfamilyModal';
import EditSubfamilyModal from '@/components/dashboard/EditSubfamilyModal';
import ImportExcelModal from '@/components/dashboard/ImportExcelModal';
import * as XLSX from 'xlsx';

interface Subfamily {
  id: string;
  reference: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count: { products: number };
}

interface Family {
  id: string;
  reference: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count: { products: number; subfamilies: number };
  subfamilies: Subfamily[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count: { products: number; families: number };
  families: Family[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedFamilies, setExpandedFamilies] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>('');
  const [selectedSubfamilyFilter, setSelectedSubfamilyFilter] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>(''); // 'famille' | 'subfamily' | ''

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Modal states
  const [isAddFamilyModalOpen, setIsAddFamilyModalOpen] = useState(false);
  const [isEditFamilyModalOpen, setIsEditFamilyModalOpen] = useState(false);
  const [isAddSubfamilyModalOpen, setIsAddSubfamilyModalOpen] = useState(false);
  const [isEditSubfamilyModalOpen, setIsEditSubfamilyModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Selected items
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [selectedSubfamily, setSelectedSubfamily] = useState<Subfamily | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?include=families');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleFamily = (familyId: string) => {
    const newExpanded = new Set(expandedFamilies);
    if (newExpanded.has(familyId)) {
      newExpanded.delete(familyId);
    } else {
      newExpanded.add(familyId);
    }
    setExpandedFamilies(newExpanded);
  };

  const handleAddFamily = (category: Category) => {
    setSelectedCategory({ id: category.id, name: category.name });
    setIsAddFamilyModalOpen(true);
  };

  const handleEditFamily = (family: Family) => {
    setSelectedFamily(family);
    setIsEditFamilyModalOpen(true);
  };

  const handleAddSubfamily = (family: Family) => {
    setSelectedFamily(family);
    setIsAddSubfamilyModalOpen(true);
  };

  const handleEditSubfamily = (subfamily: Subfamily) => {
    setSelectedSubfamily(subfamily);
    setIsEditSubfamilyModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddFamilyModalOpen(false);
    setIsEditFamilyModalOpen(false);
    setIsAddSubfamilyModalOpen(false);
    setIsEditSubfamilyModalOpen(false);
    setSelectedCategory(null);
    setSelectedFamily(null);
    setSelectedSubfamily(null);
  };

  const handleSuccess = () => {
    fetchCategories();
  };

  const handleExportExcel = () => {
    // Create data for Excel export
    const data: any[] = [];

    categories.forEach((category) => {
      category.families?.forEach((family) => {
        if (family.subfamilies && family.subfamilies.length > 0) {
          family.subfamilies.forEach((subfamily) => {
            data.push({
              'Catégorie': category.name,
              'Référence Famille': family.reference,
              'Nom Famille': family.name,
              'Référence Sous-famille': subfamily.reference,
              'Nom Sous-famille': subfamily.name
            });
          });
        } else {
          data.push({
            'Catégorie': category.name,
            'Référence Famille': family.reference,
            'Nom Famille': family.name,
            'Référence Sous-famille': '',
            'Nom Sous-famille': ''
          });
        }
      });
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, // Catégorie
      { wch: 20 }, // Référence Famille
      { wch: 30 }, // Nom Famille
      { wch: 25 }, // Référence Sous-famille
      { wch: 35 }, // Nom Sous-famille
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Catégories');

    // Generate file and download
    XLSX.writeFile(wb, `categories-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleImportExcel = () => {
    setIsImportModalOpen(true);
  };

  // Filter data for table view
  const getFilteredData = () => {
    let filtered: Array<{
      category: Category;
      family: Family;
      subfamily?: Subfamily;
      isFamilyRow?: boolean;
    }> = [];

    categories.forEach((category) => {
      // Apply category filter
      if (selectedCategoryFilter && category.id !== selectedCategoryFilter) {
        return;
      }

      category.families?.forEach((family) => {
        // Apply family filter
        if (selectedFamilyFilter && family.id !== selectedFamilyFilter) {
          return;
        }

        // Apply search filter for family
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const familyMatches =
            category.name.toLowerCase().includes(query) ||
            family.reference.toLowerCase().includes(query) ||
            family.name.toLowerCase().includes(query);

          const subfamilyMatches = family.subfamilies?.some(sf =>
            sf.reference.toLowerCase().includes(query) ||
            sf.name.toLowerCase().includes(query)
          );

          if (!familyMatches && !subfamilyMatches) return;
        }

        // Add family row (if type filter allows)
        if (!selectedTypeFilter || selectedTypeFilter === 'famille') {
          filtered.push({ category, family, isFamilyRow: true });
        }

        // Add subfamily rows
        if (family.subfamilies && family.subfamilies.length > 0) {
          family.subfamilies.forEach((subfamily) => {
            // Apply subfamily filter
            if (selectedSubfamilyFilter && subfamily.id !== selectedSubfamilyFilter) {
              return;
            }

            // Apply type filter
            if (selectedTypeFilter && selectedTypeFilter !== 'subfamily') {
              return;
            }

            // If searching, only show matching subfamilies
            if (searchQuery) {
              const query = searchQuery.toLowerCase();
              const matchesSearch =
                category.name.toLowerCase().includes(query) ||
                family.reference.toLowerCase().includes(query) ||
                family.name.toLowerCase().includes(query) ||
                subfamily.reference.toLowerCase().includes(query) ||
                subfamily.name.toLowerCase().includes(query);

              if (!matchesSearch) return;
            }

            filtered.push({ category, family, subfamily, isFamilyRow: false });
          });
        }
      });
    });

    return filtered;
  };

  // Paginate data
  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);

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
      {selectedCategory && (
        <AddFamilyModal
          isOpen={isAddFamilyModalOpen}
          onClose={handleModalClose}
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          onSuccess={handleSuccess}
        />
      )}
      {selectedFamily && isEditFamilyModalOpen && (
        <EditFamilyModal
          isOpen={isEditFamilyModalOpen}
          onClose={handleModalClose}
          family={selectedFamily}
          onSuccess={handleSuccess}
        />
      )}
      {selectedFamily && isAddSubfamilyModalOpen && (
        <AddSubfamilyModal
          isOpen={isAddSubfamilyModalOpen}
          onClose={handleModalClose}
          familyId={selectedFamily.id}
          familyName={selectedFamily.name}
          familyReference={selectedFamily.reference}
          onSuccess={handleSuccess}
        />
      )}
      {selectedSubfamily && (
        <EditSubfamilyModal
          isOpen={isEditSubfamilyModalOpen}
          onClose={handleModalClose}
          subfamily={selectedSubfamily}
          onSuccess={handleSuccess}
        />
      )}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleSuccess}
      />
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              Gestion des Catégories
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
              {categories.length} catégories principales
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {/* View Toggle */}
            <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '0.75rem', padding: '0.25rem', border: '1px solid #E5E7EB' }}>
              <button
                onClick={() => setViewMode('tree')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: viewMode === 'tree' ? 'white' : 'transparent',
                  color: viewMode === 'tree' ? '#7ED321' : '#6B7280',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'tree' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <Network className="h-4 w-4" />
                Arbre
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: viewMode === 'table' ? 'white' : 'transparent',
                  color: viewMode === 'table' ? '#7ED321' : '#6B7280',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <List className="h-4 w-4" />
                Tableau
              </button>
            </div>

            <button
              onClick={handleExportExcel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#F3F4F6',
                color: '#4A4A4A',
                border: '1px solid #E5E7EB',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: 'pointer',
              }}
            >
              <Download className="h-5 w-5" />
              Exporter Excel
            </button>
            <button
              onClick={handleImportExcel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              }}
            >
              <Upload className="h-5 w-5" />
              Importer Excel
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid #3B82F6',
          borderRadius: '0.75rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
          Structure hiérarchique
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#4A4A4A', lineHeight: '1.6' }}>
          Catégorie → Famille (FAM-XXX) → Sous-famille (SUB-XXX). Les références permettent l'import facile de milliers de produits.
        </p>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div>
          {/* Filters and Actions */}
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              padding: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            {/* First Row: Search and Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {/* Search */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                  Recherche
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom ou référence..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Category Filter */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                  Catégorie
                </label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    setSelectedFamilyFilter('');
                    setSelectedSubfamilyFilter('');
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Toutes</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Family Filter */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                  Famille
                </label>
                <select
                  value={selectedFamilyFilter}
                  onChange={(e) => {
                    setSelectedFamilyFilter(e.target.value);
                    setSelectedSubfamilyFilter('');
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Toutes</option>
                  {categories
                    .filter(cat => !selectedCategoryFilter || cat.id === selectedCategoryFilter)
                    .flatMap(cat => cat.families || [])
                    .map(family => (
                      <option key={family.id} value={family.id}>
                        {family.reference} - {family.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Subfamily Filter */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                  Sous-famille
                </label>
                <select
                  value={selectedSubfamilyFilter}
                  onChange={(e) => {
                    setSelectedSubfamilyFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Toutes</option>
                  {categories
                    .filter(cat => !selectedCategoryFilter || cat.id === selectedCategoryFilter)
                    .flatMap(cat => cat.families || [])
                    .filter(family => !selectedFamilyFilter || family.id === selectedFamilyFilter)
                    .flatMap(family => family.subfamilies || [])
                    .map(subfamily => (
                      <option key={subfamily.id} value={subfamily.id}>
                        {subfamily.reference} - {subfamily.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Type Filter */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                  Type
                </label>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => {
                    setSelectedTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Tous</option>
                  <option value="famille">Famille</option>
                  <option value="subfamily">Sous-famille</option>
                </select>
              </div>
            </div>

            {/* Second Row: Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  if (categories.length > 0) {
                    setSelectedCategory({ id: categories[0].id, name: categories[0].name });
                    setIsAddFamilyModalOpen(true);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Plus className="h-4 w-4" />
                Famille
              </button>
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                  Type
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                  Catégorie
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                  Référence Famille
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                  Nom Famille
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                  Référence Sous-famille
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                  Nom Sous-famille
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                  Produits
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredData().length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                    Aucun résultat trouvé
                  </td>
                </tr>
              ) : (
                getPaginatedData().map((item, index) => (
                  <tr
                    key={`${item.category.id}-${item.family.id}-${item.subfamily?.id || 'empty'}-${index}`}
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                  >
                    {/* Type Badge */}
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background: item.isFamilyRow ? 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {item.isFamilyRow ? 'Famille' : 'Sous-famille'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1F2937', fontWeight: '500' }}>
                      {item.category.name}
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
                        {item.family.reference}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A', fontWeight: '500' }}>
                      {item.family.name}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {item.subfamily ? (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: '#3B82F6',
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '0.25rem',
                          }}
                        >
                          {item.subfamily.reference}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {item.subfamily ? item.subfamily.name : '-'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6B7280', textAlign: 'center' }}>
                      {item.subfamily ? item.subfamily._count.products : item.family._count.products}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {item.isFamilyRow ? (
                          <>
                            <button
                              onClick={() => handleAddSubfamily(item.family)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              <Plus className="h-3 w-3" />
                              <span>Sous-famille</span>
                            </button>
                            <button
                              onClick={() => handleEditFamily(item.family)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: '#F3F4F6',
                                color: '#4A4A4A',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditSubfamily(item.subfamily!)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: '#F3F4F6',
                              color: '#4A4A4A',
                              border: 'none',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {getFilteredData().length > 0 && (
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              padding: '1rem 1.5rem',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Results Info */}
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Affichage de{' '}
              <span style={{ fontWeight: '600', color: '#1F2937' }}>
                {(currentPage - 1) * itemsPerPage + 1}
              </span>
              {' '}-{' '}
              <span style={{ fontWeight: '600', color: '#1F2937' }}>
                {Math.min(currentPage * itemsPerPage, getFilteredData().length)}
              </span>
              {' '}sur{' '}
              <span style={{ fontWeight: '600', color: '#1F2937' }}>
                {getFilteredData().length}
              </span>
              {' '}résultats
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: currentPage === 1 ? '#F3F4F6' : 'white',
                  color: currentPage === 1 ? '#9CA3AF' : '#4A4A4A',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                }}
              >
                Précédent
              </button>

              {/* Page Numbers */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: currentPage === page ? '#7ED321' : 'white',
                          color: currentPage === page ? 'white' : '#4A4A4A',
                          border: currentPage === page ? 'none' : '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          fontWeight: currentPage === page ? '600' : '500',
                          minWidth: '2.5rem',
                        }}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} style={{ padding: '0.5rem', color: '#9CA3AF' }}>
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: currentPage === totalPages ? '#F3F4F6' : 'white',
                  color: currentPage === totalPages ? '#9CA3AF' : '#4A4A4A',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                }}
              >
                Suivant
              </button>
            </div>

            {/* Items Per Page */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Par page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Categories Tree */}
      {viewMode === 'tree' && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          return (
            <div
              key={category.id}
              style={{
                background: 'white',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB',
                overflow: 'hidden',
              }}
            >
              {/* Category Header */}
              <div
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isExpanded ? '#F9FAFB' : 'white',
                }}
                onClick={() => toggleCategory(category.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5" style={{ color: '#7ED321' }} />
                  ) : (
                    <ChevronRight className="h-5 w-5" style={{ color: '#9CA3AF' }} />
                  )}
                  <FolderTree className="h-6 w-6" style={{ color: '#7ED321' }} />
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>
                      {category.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      {category._count.families} famille{category._count.families !== 1 ? 's' : ''} • {category._count.products} produit{category._count.products !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleAddFamily(category)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Famille
                  </button>
                </div>
              </div>

              {/* Families List */}
              {isExpanded && category.families && category.families.length > 0 && (
                <div style={{ borderTop: '1px solid #E5E7EB' }}>
                  {category.families.map((family) => {
                    const isFamilyExpanded = expandedFamilies.has(family.id);
                    return (
                      <div key={family.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        {/* Family Row */}
                        <div
                          style={{
                            padding: '1rem 1.5rem 1rem 3.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: isFamilyExpanded ? '#FAFAFA' : 'white',
                          }}
                          onClick={() => toggleFamily(family.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                            {isFamilyExpanded ? (
                              <ChevronDown className="h-4 w-4" style={{ color: '#7ED321' }} />
                            ) : (
                              <ChevronRight className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                            )}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                                  {family.reference}
                                </span>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937' }}>
                                  {family.name}
                                </h4>
                              </div>
                              <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.25rem' }}>
                                {family._count.subfamilies} sous-famille{family._count.subfamilies !== 1 ? 's' : ''} • {family._count.products} produit{family._count.products !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleAddSubfamily(family)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: '#F3F4F6',
                                color: '#4A4A4A',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '0.8125rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                              }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Sous-famille
                            </button>
                            <button
                              onClick={() => handleEditFamily(family)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: '#F3F4F6',
                                color: '#4A4A4A',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Subfamilies List */}
                        {isFamilyExpanded && family.subfamilies && family.subfamilies.length > 0 && (
                          <div style={{ background: '#FAFAFA' }}>
                            {family.subfamilies.map((subfamily) => (
                              <div
                                key={subfamily.id}
                                style={{
                                  padding: '0.875rem 1.5rem 0.875rem 6rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderTop: '1px solid #F3F4F6',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <span
                                    style={{
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      color: '#3B82F6',
                                      padding: '0.25rem 0.5rem',
                                      background: 'rgba(59, 130, 246, 0.1)',
                                      borderRadius: '0.25rem',
                                    }}
                                  >
                                    {subfamily.reference}
                                  </span>
                                  <span style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#1F2937' }}>
                                    {subfamily.name}
                                  </span>
                                  <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                                    ({subfamily._count.products} produit{subfamily._count.products !== 1 ? 's' : ''})
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleEditSubfamily(subfamily)}
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'white',
                                    color: '#4A4A4A',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State for Families */}
              {isExpanded && (!category.families || category.families.length === 0) && (
                <div style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid #E5E7EB' }}>
                  <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                    Aucune famille dans cette catégorie
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
