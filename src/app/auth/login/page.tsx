'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else {
        // Wait a bit for session to be established
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fetch session to check user role
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        // Redirect based on role
        if (session?.user?.role === 'ADMIN' || session?.user?.role === 'EMPLOYEE') {
          window.location.href = '/dashboard/admin';
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '2.5rem',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-block' }}>
            <Image
              src="/logo/logo-web.png"
              alt="Medical Store Parapharmacie"
              width={200}
              height={100}
              style={{ height: 'auto', width: '200px' }}
            />
          </Link>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '0.5rem',
            }}
          >
            Connexion
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '0.5rem',
              color: '#991B1B',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
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
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#7ED321';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
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
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem 3rem 0.875rem 3rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#7ED321';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                }}
              >
                {showPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: 'right' }}>
            <Link
              href="/auth/forgot-password"
              style={{
                fontSize: '0.875rem',
                color: '#7ED321',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: isLoading ? '#9CA3AF' : 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? (
              'Connexion...'
            ) : (
              <>
                <LogIn style={{ width: '1.25rem', height: '1.25rem' }} />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Vous n&apos;avez pas de compte ?{' '}
            <Link
              href="/auth/register"
              style={{
                color: '#7ED321',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}