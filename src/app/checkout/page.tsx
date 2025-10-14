'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, MapPin, CreditCard, Truck, Phone, Mail, User, Home, CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  postalCode: string;
  governorate: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    governorate: '',
    notes: '',
    paymentMethod: 'cash',
  });

  // Load user data and addresses when session is available
  useEffect(() => {
    if (session?.user) {
      // Fetch user profile data including phone
      const fetchUserData = async () => {
        try {
          const profileRes = await fetch('/api/user/profile');
          const profileData = await profileRes.json();

          if (profileData.user) {
            setFormData(prev => ({
              ...prev,
              firstName: profileData.user.firstName || '',
              lastName: profileData.user.lastName || '',
              email: profileData.user.email || '',
              phone: profileData.user.phone || '',
            }));
          }

          // Fetch user addresses
          const addressRes = await fetch('/api/user/addresses');
          const addressData = await addressRes.json();

          if (addressData.addresses) {
            setAddresses(addressData.addresses);
            // Set default address if available
            const defaultAddr = addressData.addresses.find((addr: Address) => addr.isDefault);
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr.id);
              setFormData(prev => ({
                ...prev,
                address: defaultAddr.address,
                city: defaultAddr.city,
                postalCode: defaultAddr.postalCode,
                governorate: defaultAddr.governorate,
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [session]);

  const governorates = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba',
    'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana',
    'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  if (items.length === 0) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px'
        }}>
          <ShoppingBag style={{
            width: '4rem',
            height: '4rem',
            color: '#9CA3AF',
            margin: '0 auto 1.5rem'
          }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Votre panier est vide
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
            Ajoutez des produits à votre panier avant de procéder au paiement
          </p>
          <Link
            href="/produits"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              backgroundColor: '#7ED321',
              color: 'white',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
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
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = formData.governorate === 'Sousse'
    ? (subtotal >= 50 ? 0 : 7)
    : (subtotal >= 100 ? 0 : 7);
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selected = addresses.find(addr => addr.id === addressId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        address: selected.address,
        city: selected.city,
        postalCode: selected.postalCode,
        governorate: selected.governorate,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.promoPrice || item.price,
        total: (item.promoPrice || item.price) * item.quantity,
      }));

      // Prepare order data
      const orderData: any = {
        items: orderItems,
        subtotal,
        shippingCost: deliveryFee,
        total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || null,
      };

      // Add address - either use selected address or create new one
      if (selectedAddressId) {
        orderData.addressId = selectedAddressId;
      } else {
        orderData.addressData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          governorate: formData.governorate,
        };
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const result = await response.json();

      // Clear cart and redirect to success page
      clearCart();
      router.push('/order-success');
    } catch (error: any) {
      console.error('Error creating order:', error);

      // Check if it's an authentication error
      if (error.message && error.message.includes('connecté')) {
        alert('Vous devez être connecté pour passer une commande. Redirection vers la page de connexion...');
        router.push('/login?redirect=/checkout');
      } else {
        alert(error.message || 'Une erreur est survenue lors de la création de la commande. Veuillez réessayer.');
      }

      setIsProcessing(false);
    }
  };

  // Group items by pack
  const groupedItems = items.reduce((acc, item) => {
    if (item.packId) {
      if (!acc.packs[item.packId]) {
        acc.packs[item.packId] = {
          packName: item.packName || 'Pack',
          items: []
        };
      }
      acc.packs[item.packId].items.push(item);
    } else {
      acc.individual.push(item);
    }
    return acc;
  }, { packs: {} as Record<string, { packName: string; items: typeof items }>, individual: [] as typeof items });

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1F4D1A 0%, #2D5F2A 100%)',
          padding: '2rem 1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
            Finaliser votre commande
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Left Column - Forms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', gridColumn: 'span 2' }}>
              {/* Personal Information */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <User style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                    Informations personnelles
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={!!session?.user}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: session?.user ? '#F3F4F6' : 'white',
                        cursor: session?.user ? 'not-allowed' : 'text'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      disabled={!!session?.user}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: session?.user ? '#F3F4F6' : 'white',
                        cursor: session?.user ? 'not-allowed' : 'text'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={!!session?.user}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: session?.user ? '#F3F4F6' : 'white',
                        cursor: session?.user ? 'not-allowed' : 'text'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={!!session?.user}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: session?.user ? '#F3F4F6' : 'white',
                        cursor: session?.user ? 'not-allowed' : 'text'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <MapPin style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                    Adresse de livraison
                  </h2>
                </div>

                {/* Saved Addresses for Logged-in Users */}
                {session?.user && addresses.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.75rem' }}>
                      Choisir une adresse enregistrée
                    </label>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          style={{
                            display: 'flex',
                            padding: '1rem',
                            border: selectedAddressId === address.id ? '2px solid #7ED321' : '2px solid #E5E7EB',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            backgroundColor: selectedAddressId === address.id ? 'rgba(126, 211, 33, 0.05)' : 'transparent',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            value={address.id}
                            checked={selectedAddressId === address.id}
                            onChange={() => handleAddressSelect(address.id)}
                            style={{ marginRight: '0.75rem', accentColor: '#7ED321' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                              {address.label}
                              {address.isDefault && (
                                <span style={{
                                  marginLeft: '0.5rem',
                                  fontSize: '0.75rem',
                                  color: '#7ED321',
                                  backgroundColor: 'rgba(126, 211, 33, 0.1)',
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '0.25rem'
                                }}>
                                  Par défaut
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                              {address.address}, {address.city} {address.postalCode}, {address.governorate}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>
                      Ou remplissez une nouvelle adresse ci-dessous
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      Adresse *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Rue, numéro, résidence..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                        Gouvernorat *
                      </label>
                      <select
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Sélectionner...</option>
                        {governorates.map((gov) => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                        Code postal *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      Notes de livraison (optionnel)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Instructions spéciales pour la livraison..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <CreditCard style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                    Mode de paiement
                  </h2>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: formData.paymentMethod === 'cash' ? '2px solid #7ED321' : '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: formData.paymentMethod === 'cash' ? 'rgba(126, 211, 33, 0.05)' : 'transparent',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      style={{ marginRight: '0.75rem', accentColor: '#7ED321' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#1F2937' }}>Paiement à la livraison</div>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                        Payez en espèces à la réception de votre commande
                      </div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    cursor: 'not-allowed',
                    backgroundColor: '#F3F4F6',
                    opacity: 0.6,
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      disabled
                      style={{ marginRight: '0.75rem', cursor: 'not-allowed' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#6B7280' }}>Carte bancaire</span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#7ED321',
                          backgroundColor: 'rgba(126, 211, 33, 0.1)',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontWeight: '600'
                        }}>
                          Bientôt disponible
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                        Paiement sécurisé par carte bancaire
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                position: 'sticky',
                top: '2rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
                  Résumé de la commande
                </h2>

                <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                  {/* Packs */}
                  {Object.entries(groupedItems.packs).map(([packId, pack]) => (
                    <div key={packId} style={{
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(126, 211, 33, 0.05)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(126, 211, 33, 0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Package style={{ width: '1rem', height: '1rem', color: '#7ED321' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                          {pack.packName}
                        </span>
                      </div>
                      {pack.items.map((item) => (
                        <div key={item.id} style={{ fontSize: '0.75rem', color: '#6B7280', marginLeft: '1.5rem' }}>
                          {item.name} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Individual Items */}
                  {groupedItems.individual.map((item) => {
                    const displayPrice = item.promoPrice || item.price;
                    return (
                      <div key={item.id} style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          position: 'relative',
                          borderRadius: '0.5rem',
                          overflow: 'hidden',
                          backgroundColor: '#F3F4F6',
                          flexShrink: 0
                        }}>
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized={item.image.startsWith('http')}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <ShoppingBag style={{ width: '1.5rem', height: '1.5rem', color: '#D1D5DB' }} />
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                            {item.name}
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                            Qté: {item.quantity}
                          </p>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7ED321' }}>
                            {(displayPrice * item.quantity).toFixed(2)} TND
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#6B7280' }}>Sous-total</span>
                    <span style={{ fontWeight: '600', color: '#1F2937' }}>{subtotal.toFixed(2)} TND</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#6B7280' }}>Livraison</span>
                    <span style={{ fontWeight: '600', color: deliveryFee === 0 ? '#7ED321' : '#1F2937' }}>
                      {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toFixed(2)} TND`}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid #E5E7EB'
                  }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937' }}>Total</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7ED321' }}>
                      {total.toFixed(2)} TND
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: isProcessing ? '#9CA3AF' : '#7ED321',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.backgroundColor = '#6AB81E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.backgroundColor = '#7ED321';
                    }
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite'
                      }} />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                      Confirmer la commande
                    </>
                  )}
                </button>

                <style jsx>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
