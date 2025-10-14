'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import WishlistNotification from './WishlistNotification';

export default function WishlistNotificationWrapper() {
  const { lastAddedItem, showNotification, hideNotification } = useWishlist();

  return (
    <WishlistNotification
      item={lastAddedItem}
      isVisible={showNotification}
      onClose={hideNotification}
    />
  );
}
