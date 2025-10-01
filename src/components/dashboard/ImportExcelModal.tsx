'use client';

import { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportResult {
  totalRows: number;
  successfulFamilies: number;
  successfulSubfamilies: number;
  failedRows: Array<{
    row: number;
    data: any;
    error: string;
  }>;
  createdFamilies: string[];
  createdSubfamilies: string[];
}

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ImportExcelModal({
  isOpen,
  onClose,
  onSuccess,
}: ImportExcelModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if it's an Excel file
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];

      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls') && !selectedFile.name.endsWith('.csv')) {
        setError('Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/categories/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue lors de l\'import');
        setIsLoading(false);
        return;
      }

      // Show results
      setImportResult(data.result);
      setShowResults(true);
      setIsLoading(false);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'import');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFile(null);
      setError('');
      setImportResult(null);
      setShowResults(false);
      onClose();
    }
  };

  const handleFinish = () => {
    if (onSuccess) onSuccess();
    handleClose();
  };

  const handleDownloadTemplate = () => {
    // Create Excel template with 3 examples for each of the 8 categories
    const data = [
      // Vitamines & Compléments (3 examples)
      {
        'Catégorie': 'Vitamines & Compléments',
        'Référence Famille': '00001',
        'Nom Famille': 'Vitamine A',
        'Référence Sous-famille': '10001',
        'Nom Sous-famille': 'Vitamine A 1000mg'
      },
      {
        'Catégorie': 'Vitamines & Compléments',
        'Référence Famille': '00002',
        'Nom Famille': 'Vitamine C',
        'Référence Sous-famille': '10002',
        'Nom Sous-famille': 'Vitamine C 500mg'
      },
      {
        'Catégorie': 'Vitamines & Compléments',
        'Référence Famille': '00003',
        'Nom Famille': 'Oméga 3',
        'Référence Sous-famille': '10003',
        'Nom Sous-famille': 'Oméga 3 Fish Oil'
      },

      // Capillaires (3 examples)
      {
        'Catégorie': 'Capillaires',
        'Référence Famille': '00004',
        'Nom Famille': 'Shampoings',
        'Référence Sous-famille': '10004',
        'Nom Sous-famille': 'Shampoing Anti-chute'
      },
      {
        'Catégorie': 'Capillaires',
        'Référence Famille': '00005',
        'Nom Famille': 'Soins Capillaires',
        'Référence Sous-famille': '10005',
        'Nom Sous-famille': 'Masque Réparateur'
      },
      {
        'Catégorie': 'Capillaires',
        'Référence Famille': '00006',
        'Nom Famille': 'Colorations',
        'Référence Sous-famille': '10006',
        'Nom Sous-famille': 'Coloration Permanente'
      },

      // Soins Visage (3 examples)
      {
        'Catégorie': 'Soins Visage',
        'Référence Famille': '00007',
        'Nom Famille': 'Crèmes Hydratantes',
        'Référence Sous-famille': '10007',
        'Nom Sous-famille': 'Crème Hydratante Jour'
      },
      {
        'Catégorie': 'Soins Visage',
        'Référence Famille': '00008',
        'Nom Famille': 'Sérums',
        'Référence Sous-famille': '10008',
        'Nom Sous-famille': 'Sérum Anti-âge'
      },
      {
        'Catégorie': 'Soins Visage',
        'Référence Famille': '00009',
        'Nom Famille': 'Nettoyants',
        'Référence Sous-famille': '10009',
        'Nom Sous-famille': 'Gel Nettoyant Doux'
      },

      // Soins Corps (3 examples)
      {
        'Catégorie': 'Soins Corps',
        'Référence Famille': '00010',
        'Nom Famille': 'Laits Corps',
        'Référence Sous-famille': '10010',
        'Nom Sous-famille': 'Lait Hydratant Corps'
      },
      {
        'Catégorie': 'Soins Corps',
        'Référence Famille': '00011',
        'Nom Famille': 'Gels Douche',
        'Référence Sous-famille': '10011',
        'Nom Sous-famille': 'Gel Douche Surgras'
      },
      {
        'Catégorie': 'Soins Corps',
        'Référence Famille': '00012',
        'Nom Famille': 'Déodorants',
        'Référence Sous-famille': '10012',
        'Nom Sous-famille': 'Déodorant Sans Alcool'
      },

      // Bébé & Maman (3 examples)
      {
        'Catégorie': 'Bébé & Maman',
        'Référence Famille': '00013',
        'Nom Famille': 'Soins Bébé',
        'Référence Sous-famille': '10013',
        'Nom Sous-famille': 'Crème Change Bébé'
      },
      {
        'Catégorie': 'Bébé & Maman',
        'Référence Famille': '00014',
        'Nom Famille': 'Alimentation Bébé',
        'Référence Sous-famille': '10014',
        'Nom Sous-famille': 'Lait Infantile 1er Âge'
      },
      {
        'Catégorie': 'Bébé & Maman',
        'Référence Famille': '00015',
        'Nom Famille': 'Maternité',
        'Référence Sous-famille': '10015',
        'Nom Sous-famille': 'Crème Anti-vergetures'
      },

      // Bio & Naturel (3 examples)
      {
        'Catégorie': 'Bio & Naturel',
        'Référence Famille': '00016',
        'Nom Famille': 'Cosmétiques Bio',
        'Référence Sous-famille': '10016',
        'Nom Sous-famille': 'Huile Argan Bio'
      },
      {
        'Catégorie': 'Bio & Naturel',
        'Référence Famille': '00017',
        'Nom Famille': 'Compléments Bio',
        'Référence Sous-famille': '10017',
        'Nom Sous-famille': 'Spiruline Bio'
      },
      {
        'Catégorie': 'Bio & Naturel',
        'Référence Famille': '00018',
        'Nom Famille': 'Tisanes Bio',
        'Référence Sous-famille': '10018',
        'Nom Sous-famille': 'Tisane Detox Bio'
      },

      // Hygiène Intime (3 examples)
      {
        'Catégorie': 'Hygiène Intime',
        'Référence Famille': '00019',
        'Nom Famille': 'Soins Intimes',
        'Référence Sous-famille': '10019',
        'Nom Sous-famille': 'Gel Intime Doux'
      },
      {
        'Catégorie': 'Hygiène Intime',
        'Référence Famille': '00020',
        'Nom Famille': 'Protections',
        'Référence Sous-famille': '10020',
        'Nom Sous-famille': 'Protège-slips'
      },
      {
        'Catégorie': 'Hygiène Intime',
        'Référence Famille': '00021',
        'Nom Famille': 'Lingettes Intimes',
        'Référence Sous-famille': '10021',
        'Nom Sous-famille': 'Lingettes Fraîcheur'
      },

      // Matériel Médical (3 examples)
      {
        'Catégorie': 'Matériel Médical',
        'Référence Famille': '00022',
        'Nom Famille': 'Tensiomètres',
        'Référence Sous-famille': '10022',
        'Nom Sous-famille': 'Tensiomètre Électronique'
      },
      {
        'Catégorie': 'Matériel Médical',
        'Référence Famille': '00023',
        'Nom Famille': 'Thermomètres',
        'Référence Sous-famille': '10023',
        'Nom Sous-famille': 'Thermomètre Infrarouge'
      },
      {
        'Catégorie': 'Matériel Médical',
        'Référence Famille': '00024',
        'Nom Famille': 'Pansements',
        'Référence Sous-famille': '10024',
        'Nom Sous-famille': 'Pansements Stériles'
      },
    ];

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
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    // Download file
    XLSX.writeFile(wb, 'template-import-categories.xlsx');
  };

  // Show results view if import is complete
  if (showResults && importResult) {
    const hasErrors = importResult.failedRows.length > 0;
    const successRate = ((importResult.successfulFamilies + importResult.successfulSubfamilies) / importResult.totalRows * 100).toFixed(0);

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
      >
        <div
          style={{
            background: 'white',
            borderRadius: '1rem',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid #E5E7EB',
              background: hasErrors ? '#FEF3C7' : '#D1FAE5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {hasErrors ? (
                <AlertCircle className="h-8 w-8" style={{ color: '#F59E0B' }} />
              ) : (
                <CheckCircle className="h-8 w-8" style={{ color: '#10B981' }} />
              )}
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
                  {hasErrors ? 'Import Terminé avec des Erreurs' : 'Import Réussi !'}
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                  {successRate}% de réussite
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Total Rows */}
              <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Total Lignes</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>{importResult.totalRows}</p>
              </div>

              {/* Successful Families */}
              <div style={{ padding: '1rem', background: '#D1FAE5', borderRadius: '0.5rem', border: '1px solid #10B981' }}>
                <p style={{ fontSize: '0.75rem', color: '#065F46', marginBottom: '0.25rem' }}>Familles Créées</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#065F46' }}>{importResult.successfulFamilies}</p>
              </div>

              {/* Successful Subfamilies */}
              <div style={{ padding: '1rem', background: '#DBEAFE', borderRadius: '0.5rem', border: '1px solid #3B82F6' }}>
                <p style={{ fontSize: '0.75rem', color: '#1E40AF', marginBottom: '0.25rem' }}>Sous-familles Créées</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E40AF' }}>{importResult.successfulSubfamilies}</p>
              </div>

              {/* Failed Rows */}
              <div style={{ padding: '1rem', background: '#FEE2E2', borderRadius: '0.5rem', border: '1px solid #EF4444' }}>
                <p style={{ fontSize: '0.75rem', color: '#991B1B', marginBottom: '0.25rem' }}>Lignes Échouées</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#991B1B' }}>{importResult.failedRows.length}</p>
              </div>
            </div>

            {/* Errors Details */}
            {importResult.failedRows.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.75rem' }}>
                  Détails des Erreurs
                </h3>
                <div
                  style={{
                    maxHeight: '200px',
                    overflow: 'auto',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                  }}
                >
                  {importResult.failedRows.map((failedRow, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.75rem',
                        borderBottom: index < importResult.failedRows.length - 1 ? '1px solid #F3F4F6' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <XCircle className="h-4 w-4" style={{ color: '#EF4444' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                          Ligne {failedRow.row}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginLeft: '1.5rem' }}>
                        {failedRow.error}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                        {failedRow.data['Catégorie']} - {failedRow.data['Référence Famille']} - {failedRow.data['Nom Famille']}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={handleFinish}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          maxWidth: '600px',
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
              Importer depuis Excel
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
              Importez vos familles et sous-familles en masse
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

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Info Box */}
            <div
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                border: '1px solid #3B82F6',
                borderRadius: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <AlertCircle className="h-5 w-5" style={{ color: '#3B82F6', flexShrink: 0, marginTop: '0.125rem' }} />
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                    Format du fichier Excel
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#4A4A4A', lineHeight: '1.5' }}>
                    Votre fichier doit contenir 5 colonnes : <strong>Catégorie</strong>, <strong>Référence Famille</strong>, <strong>Nom Famille</strong>, <strong>Référence Sous-famille</strong>, <strong>Nom Sous-famille</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Download Template Button */}
            <button
              type="button"
              onClick={handleDownloadTemplate}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                background: '#F3F4F6',
                color: '#4A4A4A',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              <Download className="h-4 w-4" />
              Télécharger le modèle Excel
            </button>

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

            {/* File Upload */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '0.5rem',
                }}
              >
                Fichier Excel <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div
                style={{
                  position: 'relative',
                  border: '2px dashed #E5E7EB',
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  textAlign: 'center',
                  background: file ? '#F9FAFB' : 'white',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                />
                <FileSpreadsheet
                  className="h-12 w-12"
                  style={{ color: file ? '#7ED321' : '#9CA3AF', margin: '0 auto', marginBottom: '0.5rem' }}
                />
                {file ? (
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1F2937' }}>
                      Cliquez pour sélectionner un fichier
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      Formats acceptés: .xlsx, .xls, .csv
                    </p>
                  </div>
                )}
              </div>
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
              disabled={isLoading || !file}
              style={{
                padding: '0.75rem 1.5rem',
                background:
                  isLoading || !file
                    ? '#9CA3AF'
                    : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: isLoading || !file ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Upload className="h-4 w-4" />
              {isLoading ? 'Import en cours...' : 'Importer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
