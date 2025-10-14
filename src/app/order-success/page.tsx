'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Commande Confirmée !
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Merci pour votre commande. Nous avons bien reçu votre demande et nous allons la traiter dans les plus brefs délais.
          </p>

          {/* Order Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Package className="w-6 h-6 text-[#7ED321]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Prochaines étapes
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Vous recevrez un email de confirmation avec les détails de votre commande.
              Notre équipe vous contactera bientôt pour confirmer la livraison.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/compte/commandes"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#7ED321] text-white rounded-xl font-semibold hover:bg-[#6AB81E] transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Package className="w-5 h-5" />
              Voir mes commandes
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/produits"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#7ED321] text-[#7ED321] rounded-xl font-semibold hover:bg-[#7ED321] hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Continuer mes achats
            </Link>
          </div>

          {/* Auto Redirect Notice */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <p>
              Redirection vers la page d&apos;accueil dans{' '}
              <span className="font-semibold text-[#7ED321]">{countdown}s</span>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Besoin d&apos;aide ? {' '}
            <Link href="/contact" className="text-[#7ED321] font-semibold hover:underline">
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
