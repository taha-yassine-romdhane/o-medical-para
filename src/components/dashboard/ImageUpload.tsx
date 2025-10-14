'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      await uploadImage(imageFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await uploadImage(files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to your API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#4A4A4A',
        marginBottom: '0.5rem'
      }}>
        {label}
      </label>

      {value ? (
        <div style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          border: '2px solid #E5E7EB'
        }}>
          <Image
            src={value}
            alt="Uploaded"
            fill
            style={{ objectFit: 'cover' }}
            unoptimized={value.startsWith('http')}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B91C1C';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowse}
          style={{
            width: '100%',
            height: '200px',
            border: `2px dashed ${isDragging ? '#7ED321' : '#E5E7EB'}`,
            borderRadius: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: isDragging ? 'rgba(126, 211, 33, 0.05)' : '#F9FAFB',
            transition: 'all 0.2s'
          }}
        >
          {isUploading ? (
            <>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '4px solid #E5E7EB',
                borderTopColor: '#7ED321',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                Téléchargement en cours...
              </p>
            </>
          ) : (
            <>
              <Upload style={{
                width: '3rem',
                height: '3rem',
                color: isDragging ? '#7ED321' : '#9CA3AF',
                marginBottom: '0.75rem'
              }} />
              <p style={{ color: '#4A4A4A', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                Glissez et déposez une image
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                ou cliquez pour parcourir
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                PNG, JPG, GIF jusqu&apos;à 5MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
