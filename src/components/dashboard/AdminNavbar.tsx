'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { LogOut, Clock, Calendar, Home } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getRoleBadgeColor = () => {
    if (session?.user?.role === 'ADMIN') return { bg: '#7ED321', text: '#1F4D1A' };
    if (session?.user?.role === 'EMPLOYEE') return { bg: '#3B82F6', text: '#1E3A8A' };
    return { bg: '#9CA3AF', text: '#1F2937' };
  };

  const getRoleLabel = () => {
    if (session?.user?.role === 'ADMIN') return 'Administrateur';
    if (session?.user?.role === 'EMPLOYEE') return 'Employé';
    return 'Utilisateur';
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard/admin') return 'Tableau de bord';
    if (pathname.includes('/products')) return 'Gestion des Produits';
    if (pathname.includes('/categories')) return 'Gestion des Catégories';
    if (pathname.includes('/orders')) return 'Gestion des Commandes';
    if (pathname.includes('/users')) return 'Gestion des Clients';
    if (pathname.includes('/contacts')) return 'Messages de Contact';
    if (pathname.includes('/promotions')) return 'Gestion des Promotions';
    if (pathname.includes('/analytics')) return 'Statistiques & Analytics';
    if (pathname.includes('/user-management')) return 'Gestion des Utilisateurs';
    if (pathname.includes('/settings')) return 'Paramètres';
    return 'Administration';
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Page Title & Breadcrumb */}
          <div className="flex items-center gap-4 flex-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#7ED321] hover:bg-gray-50 rounded-lg transition-all"
              title="Retour au site"
            >
              <Home className="h-5 w-5" />
            </Link>
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Administration • Ô Medical Store
              </p>
            </div>
          </div>

          {/* Center - Date & Time */}
          {isMounted && currentTime && (
            <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 mx-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-[#7ED321]" />
                <span className="text-sm font-medium">{formatDate(currentTime)}</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-[#7ED321]" />
                <span className="text-sm font-mono font-semibold">{formatTime(currentTime)}</span>
              </div>
            </div>
          )}

          {/* Right side - Actions & User info */}
          {session?.user && (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7ED321] to-[#6AB81E] flex items-center justify-center text-white font-bold shadow-md">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {session.user.name}
                  </p>
                  <span
                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5"
                    style={{
                      background: getRoleBadgeColor().bg,
                      color: getRoleBadgeColor().text,
                    }}
                  >
                    {getRoleLabel()}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200"
                title="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden xl:inline text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Date & Time */}
      {isMounted && currentTime && (
        <div className="lg:hidden px-4 pb-3 flex items-center justify-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#7ED321]" />
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="h-3 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#7ED321]" />
            <span className="font-mono font-semibold">{formatTime(currentTime)}</span>
          </div>
        </div>
      )}
    </nav>
  );
}
