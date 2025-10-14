'use client';

import { RotateCcw, Clock, Package, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import Link from 'next/link';

export default function RetoursPage() {
  const returnConditions = [
    { icon: Clock, title: '14 jours', description: 'Délai de rétractation' },
    { icon: Package, title: 'Emballage intact', description: 'Produit non ouvert et dans son emballage d\'origine' },
    { icon: CheckCircle, title: 'État neuf', description: 'Produit non utilisé et en parfait état' },
  ];

  const returnSteps = [
    { step: '1', title: 'Contactez-nous', description: 'Informez-nous de votre souhait de retour par téléphone ou email' },
    { step: '2', title: 'Préparez le colis', description: 'Emballez soigneusement le produit dans son emballage d\'origine' },
    { step: '3', title: 'Renvoi du produit', description: 'Expédiez le colis à notre adresse avec le bon de retour' },
    { step: '4', title: 'Remboursement', description: 'Recevez votre remboursement sous 7 à 10 jours ouvrés' },
  ];

  const nonReturnableProducts = [
    'Produits d\'hygiène personnelle',
    'Médicaments et compléments alimentaires ouverts',
    'Produits cosmétiques descellés',
    'Articles personnalisés ou sur-mesure',
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
            <RotateCcw className="h-10 w-10" style={{ color: '#7ED321' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'white',
              margin: 0
            }}>
              Retours et Remboursements
            </h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Politique de retour simple et transparente
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        {/* Return Conditions */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
            Conditions de retour
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {returnConditions.map((condition, index) => {
              const IconComponent = condition.icon;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    border: '2px solid #E5E7EB',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7ED321';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: 'rgba(126, 211, 33, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <IconComponent style={{ width: '2rem', height: '2rem', color: '#7ED321' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                    {condition.title}
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                    {condition.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return Steps */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
            Procédure de retour
          </h2>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {returnSteps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#7ED321',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>
                      {step.step}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      {step.title}
                    </h3>
                    <p style={{ color: '#6B7280', margin: 0 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Non-returnable Products */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '2px solid #FEE2E2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <AlertCircle style={{ width: '2rem', height: '2rem', color: '#DC2626' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                Produits non retournables
              </h2>
            </div>
            <ul style={{ color: '#6B7280', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
              {nonReturnableProducts.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#FEF2F2',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#991B1B', fontSize: '0.875rem', margin: 0 }}>
                Pour des raisons d&apos;hygiène et de sécurité, certains produits ne peuvent être retournés une fois ouverts ou utilisés.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
              Remboursement
            </h3>
            <ul style={{ color: '#6B7280', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Remboursement intégral sous 7 à 10 jours ouvrés</li>
              <li>Même moyen de paiement que la commande</li>
              <li>Notification par email à réception du colis</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
              Échange
            </h3>
            <ul style={{ color: '#6B7280', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Possibilité d&apos;échange selon disponibilité</li>
              <li>Même procédure que le retour</li>
              <li>Pas de frais supplémentaires</li>
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Besoin d&apos;aide pour un retour ?
          </h3>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            Notre service client est là pour vous accompagner
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
