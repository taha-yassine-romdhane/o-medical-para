'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Package, Truck, CreditCard, RotateCcw, Phone } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqCategories = [
    {
      category: 'Commandes',
      icon: Package,
      questions: [
        {
          question: 'Comment passer une commande ?',
          answer: 'Pour passer une commande, ajoutez simplement les produits souhaités à votre panier, puis cliquez sur "Commander". Suivez les étapes pour renseigner vos informations de livraison et finaliser votre achat.'
        },
        {
          question: 'Puis-je modifier ma commande après validation ?',
          answer: 'Vous pouvez modifier votre commande dans les 30 minutes suivant la validation en nous contactant par téléphone au +216 53 000 666. Passé ce délai, la commande sera en cours de préparation.'
        },
        {
          question: 'Comment puis-je suivre ma commande ?',
          answer: 'Après validation de votre commande, vous recevrez un email de confirmation avec un numéro de suivi. Vous pouvez également suivre l\'état de votre commande dans votre espace compte.'
        }
      ]
    },
    {
      category: 'Livraison',
      icon: Truck,
      questions: [
        {
          question: 'Quels sont les délais de livraison ?',
          answer: 'Pour Sousse et environs : 24-48h. Pour les autres gouvernorats : 48-72h. Les livraisons sont effectuées 7j/7.'
        },
        {
          question: 'Quels sont les frais de livraison ?',
          answer: 'La livraison est gratuite à Sousse dès 50 TND d\'achat. Pour les autres régions, les frais sont de 7 TND (gratuite dès 100 TND).'
        },
        {
          question: 'Livrez-vous dans toute la Tunisie ?',
          answer: 'Oui, nous livrons dans tous les gouvernorats de Tunisie. Les délais peuvent varier selon votre localisation.'
        }
      ]
    },
    {
      category: 'Paiement',
      icon: CreditCard,
      questions: [
        {
          question: 'Quels modes de paiement acceptez-vous ?',
          answer: 'Nous acceptons le paiement à la livraison (espèces), par carte bancaire en ligne, et par virement bancaire.'
        },
        {
          question: 'Le paiement en ligne est-il sécurisé ?',
          answer: 'Oui, tous les paiements en ligne sont sécurisés via un système de cryptage SSL. Vos données bancaires sont protégées.'
        },
        {
          question: 'Puis-je payer en plusieurs fois ?',
          answer: 'Pour l\'instant, nous n\'offrons pas le paiement en plusieurs fois. Le paiement doit être effectué en une seule fois.'
        }
      ]
    },
    {
      category: 'Retours et Remboursements',
      icon: RotateCcw,
      questions: [
        {
          question: 'Quel est le délai pour retourner un produit ?',
          answer: 'Vous disposez de 14 jours à compter de la réception de votre commande pour effectuer un retour, à condition que le produit soit dans son emballage d\'origine et non utilisé.'
        },
        {
          question: 'Comment effectuer un retour ?',
          answer: 'Contactez notre service client par téléphone ou email pour initier un retour. Nous vous fournirons un bon de retour à joindre avec le colis.'
        },
        {
          question: 'Sous combien de temps suis-je remboursé ?',
          answer: 'Le remboursement est effectué sous 7 à 10 jours ouvrés après réception et vérification du produit retourné.'
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1F4D1A 0%, #2D5F2A 100%)',
          padding: '3rem 1.5rem',
          marginBottom: '3rem'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <HelpCircle className="h-10 w-10" style={{ color: '#7ED321' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'white',
              margin: 0
            }}>
              Questions Fréquentes (FAQ)
            </h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        {faqCategories.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={categoryIndex} style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: 'rgba(126, 211, 33, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComponent style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                  {category.category}
                </h2>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 10 + questionIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={questionIndex}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        border: isOpen ? '2px solid #7ED321' : '2px solid transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        style={{
                          width: '100%',
                          padding: '1.25rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: isOpen ? 'rgba(126, 211, 33, 0.05)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isOpen) {
                            e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isOpen) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <span style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#1F2937'
                        }}>
                          {faq.question}
                        </span>
                        <ChevronDown
                          style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            color: '#7ED321',
                            transition: 'transform 0.2s',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            flexShrink: 0,
                            marginLeft: '1rem'
                          }}
                        />
                      </button>
                      <div
                        style={{
                          maxHeight: isOpen ? '500px' : '0',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease-in-out'
                        }}
                      >
                        <div style={{
                          padding: '0 1.25rem 1.25rem 1.25rem',
                          color: '#6B7280',
                          lineHeight: '1.6'
                        }}>
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Contact CTA */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Vous n&apos;avez pas trouvé votre réponse ?
          </h3>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            Notre équipe est disponible pour répondre à toutes vos questions
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                backgroundColor: '#7ED321',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6AB81E';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#7ED321';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Nous contacter
            </Link>
            <a
              href="tel:+21653000666"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#7ED321',
                border: '2px solid #7ED321',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Phone style={{ width: '1.25rem', height: '1.25rem' }} />
              +216 53 000 666
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
