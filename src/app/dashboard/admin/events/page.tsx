'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Eye, EyeOff, ExternalLink, Clock } from 'lucide-react';
import Image from 'next/image';
import ImageUpload from '@/components/dashboard/ImageUpload';

interface Event {
  id: string;
  image: string;
  url: string | null;
  startDate: string;
  endDate: string;
  sortOrder: number;
  isActive: boolean;
}

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    image: '',
    url: '',
    startDate: '',
    endDate: '',
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events?all=true'); // Get all events for admin
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : '/api/events';

      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue');
        return;
      }

      await fetchEvents();
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Une erreur est survenue lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openModal = (event?: Event) => {
    setError('');
    if (event) {
      setEditingEvent(event);
      // Convert ISO dates to datetime-local format
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      setFormData({
        image: event.image,
        url: event.url || '',
        startDate: formatDateForInput(startDate),
        endDate: formatDateForInput(endDate),
        sortOrder: event.sortOrder,
        isActive: event.isActive,
      });
    } else {
      setEditingEvent(null);
      // Default to current date/time
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 7);

      setFormData({
        image: '',
        url: '',
        startDate: formatDateForInput(now),
        endDate: formatDateForInput(tomorrow),
        sortOrder: events.length,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setError('');
  };

  // Format date for datetime-local input
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if event is currently active (between start and end dates)
  const isEventCurrentlyActive = (event: Event): boolean => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return now >= start && now <= end && event.isActive;
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
            Gestion des Événements
          </h1>
          <p style={{ color: '#6B7280' }}>
            Gérez les événements affichés sur la page d&apos;accueil avec planification temporelle
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Note: Un seul événement peut être affiché à la fois. Les créneaux horaires ne peuvent pas se chevaucher.
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
          Ajouter un Événement
        </button>
      </div>

      {/* Events List */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {events.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB'
          }}>
            <Calendar style={{ width: '3rem', height: '3rem', color: '#9CA3AF', margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '0.5rem' }}>
              Aucun événement configuré
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
              Commencez par ajouter votre premier événement avec planification
            </p>
          </div>
        ) : (
          events.map((event) => {
            const isCurrentlyActive = isEventCurrentlyActive(event);
            const isPast = new Date(event.endDate) < new Date();
            const isFuture = new Date(event.startDate) > new Date();

            return (
              <div
                key={event.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  border: `2px solid ${isCurrentlyActive ? '#7ED321' : '#E5E7EB'}`,
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                {/* Currently Active Indicator */}
                {isCurrentlyActive && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#7ED321',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    zIndex: 1
                  }}>
                    <span style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                    EN COURS
                  </div>
                )}

                {/* Image Preview */}
                <div
                  style={{
                    position: 'relative',
                    width: '180px',
                    height: '120px',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {event.image && event.image.trim() !== '' && (event.image.startsWith('/') || event.image.startsWith('http')) ? (
                    <Image
                      src={event.image}
                      alt="Event"
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized={event.image.startsWith('http')}
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
                      <Calendar style={{ width: '3rem', height: '3rem', color: '#9CA3AF' }} />
                    </div>
                  )}
                  {!event.isActive && (
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

                {/* Event Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: event.isActive ? '#D1FAE5' : '#FEE2E2',
                        color: event.isActive ? '#065F46' : '#991B1B',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}
                    >
                      {event.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    {isPast && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#F3F4F6',
                        color: '#6B7280',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Passé
                      </span>
                    )}
                    {isFuture && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#DBEAFE',
                        color: '#1E40AF',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        À venir
                      </span>
                    )}
                    {event.url && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#F0FDE4',
                        color: '#7ED321',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem' }} />
                        Lien
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock style={{ width: '1rem', height: '1rem', color: '#7ED321' }} />
                      <span style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '600' }}>
                        Début:
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {formatDateForDisplay(event.startDate)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock style={{ width: '1rem', height: '1rem', color: '#DC2626' }} />
                      <span style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '600' }}>
                        Fin:
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {formatDateForDisplay(event.endDate)}
                      </span>
                    </div>
                    {event.url && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ExternalLink style={{ width: '1rem', height: '1rem', color: '#7ED321' }} />
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.875rem',
                            color: '#7ED321',
                            textDecoration: 'none',
                            fontWeight: '500'
                          }}
                        >
                          {event.url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => openModal(event)}
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
                    onClick={() => handleDelete(event.id)}
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
            );
          })
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
              {editingEvent ? 'Modifier l\'Événement' : 'Ajouter un Événement'}
            </h2>

            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '0.5rem',
                color: '#991B1B',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Image de l'événement *"
                />

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                    URL de redirection (optionnel)
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    L&apos;utilisateur sera redirigé vers cette URL en cliquant sur l&apos;événement
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                    Date et heure de début *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                    Date et heure de fin *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    L&apos;événement sera affiché uniquement pendant cette période
                  </p>
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
                    {editingEvent ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
