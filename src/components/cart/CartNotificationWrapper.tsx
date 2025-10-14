'use client';

import { useCart } from '@/contexts/CartContext';
import CartNotification from './CartNotification';

export default function CartNotificationWrapper() {
  const { lastAddedItem, showNotification, hideNotification } = useCart();

  return (
    <CartNotification
      item={lastAddedItem}
      isVisible={showNotification}
      onClose={hideNotification}
    />
  );
}
