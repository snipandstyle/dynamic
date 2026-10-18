export interface CartItem {
  id: string;
  category: 'boarding' | 'grooming';
  name: string;
  subtitle?: string;
  price: number;
  origPrice: number;
  nights?: number;
  petType?: 'dog' | 'cat';
  petSize?: 'small' | 'medium' | 'large';
  petBreed?: string;
  appliedCouponCode?: string;
}

const CART_STORAGE_KEY = 'snip_cart_items';

export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading cart:', err);
  }
  return [];
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(items);
    sessionStorage.setItem(CART_STORAGE_KEY, json);
    localStorage.setItem(CART_STORAGE_KEY, json);
    window.dispatchEvent(new Event('snip_cart_updated'));
  } catch (err) {
    console.error('Error saving cart:', err);
  }
}

export function addItemToCart(item: CartItem): void {
  const current = getCartItems();
  // Check if item already exists in cart, update it
  const index = current.findIndex((i) => i.id === item.id || (i.name === item.name && i.category === item.category));
  if (index >= 0) {
    current[index] = { ...current[index], ...item };
  } else {
    current.push(item);
  }
  saveCartItems(current);

  // Dispatch custom toast notification
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('snip_show_toast', {
        detail: {
          message: `✓ Added "${item.name}" to cart! Continue browsing or checkout below.`,
          type: 'success',
        },
      })
    );
  }
}

export function removeItemFromCart(id: string): void {
  const current = getCartItems().filter((item) => item.id !== id);
  saveCartItems(current);
}

export function clearCart(): void {
  saveCartItems([]);
}
