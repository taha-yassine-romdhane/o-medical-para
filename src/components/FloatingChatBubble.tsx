'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';

const FloatingChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const chatOptions = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: '#25D366',
      url: 'https://wa.me/21653000666?text=Bonjour%2C%20j%27ai%20une%20question',
      description: 'Contactez-nous sur WhatsApp'
    },
    {
      name: 'Messenger',
      icon: FaFacebookMessenger,
      color: '#0084FF',
      url: 'https://www.facebook.com/messages/t/OMedicalStoreMsaken',
      description: 'Messagez-nous sur Facebook'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      color: '#E1306C',
      url: 'https://ig.me/m/omedical_store',
      description: 'Envoyez-nous un DM'
    }
  ];

  return (
    <>
      {/* Only show on mobile/tablet */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        {/* Chat options menu */}
        {isOpen && (
          <div
            className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 mb-2 animate-slideUp"
            style={{
              minWidth: '280px',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 text-sm">Contactez-nous</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {chatOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${option.color}15` }}
                  >
                    <option.icon
                      size={24}
                      style={{ color: option.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">
                      {option.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Disponible 7j/7 de 9h à 20h
              </p>
            </div>
          </div>
        )}

        {/* Main bubble button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #1F4D1A 0%, #2D5F2A 100%)',
            animation: isOpen ? 'none' : 'pulse 2s infinite'
          }}
          aria-label="Ouvrir le chat"
        >
          {isOpen ? (
            <X size={28} color="white" />
          ) : (
            <MessageCircle size={28} color="white" />
          )}
        </button>

        {/* Notification badge */}
        {!isOpen && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce"
            style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            3
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(126, 211, 33, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(126, 211, 33, 0);
          }
        }
      `}</style>
    </>
  );
};

export default FloatingChatBubble;
