import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  appliedCouponCode?: string;
}

interface StickyCartBarProps {
  onOpenCheckout: (item?: CartItem) => void;
}

export const StickyCartBar: React.FC<StickyCartBarProps> = ({ onOpenCheckout }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Load and listen to cart changes
  const loadCart = () => {
    try {
      const stored = sessionStorage.getItem('snip_cart_items') || localStorage.getItem('snip_cart_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
          setIsVisible(true);
          return;
        }
      }
      // Check if there is an active pending booking
      const pending = sessionStorage.getItem('snip_pending_booking');
      if (pending) {
        const p = JSON.parse(pending);
        const item: CartItem = {
          id: 'item_pending',
          category: p.type || 'boarding',
          name: p.serviceName || (p.type === 'grooming' ? 'Grooming Package' : 'Cage-Free Boarding'),
          subtitle: p.nights ? `${p.nights} Nights` : 'Studio Visit',
          price: p.basePrice ? Number(p.basePrice) * (p.nights || 1) : 625,
          origPrice: (p.origPrice || (p.basePrice + 125)) * (p.nights || 1),
          nights: p.nights || (p.type === 'boarding' ? 4 : 1),
          petType: p.petType,
          petSize: p.petSize,
          appliedCouponCode: p.appliedCouponCode,
        };
        setCartItems([item]);
        setIsVisible(true);
        return;
      }
      setCartItems([]);
      setIsVisible(false);
    } catch {
      setCartItems([]);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => loadCart();
    window.addEventListener('snip_cart_updated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    // Default to show if on mobile and user has browsed
    const timer = setTimeout(() => {
      loadCart();
    }, 1000);

    return () => {
      window.removeEventListener('snip_cart_updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
      clearTimeout(timer);
    };
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalOriginal = cartItems.reduce((sum, item) => sum + (item.origPrice || item.price || 0), 0);
  const totalSavings = Math.max(0, totalOriginal - totalAmount);

  const primaryItem = cartItems[0];

  const handleCheckoutClick = () => {
    if (primaryItem) {
      onOpenCheckout(primaryItem);
    } else {
      onOpenCheckout();
    }
  };

  if (!isVisible || cartItems.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:inset-x-auto sm:right-6 sm:w-auto z-[160]"
      >
        <div className="bg-gradient-to-r from-sanctuary-dark via-[#1A2E22] to-sanctuary-forest text-white rounded-2xl sm:rounded-3xl p-3 sm:py-3 sm:px-5 shadow-2xl border-2 border-amber-400 flex items-center justify-between gap-3 sm:gap-6 backdrop-blur-md">
          {/* Cart Icon & Service Summary */}
          <div className="flex items-center gap-2.5 truncate">
            <div className="relative size-10 rounded-xl bg-amber-400 text-sanctuary-dark flex items-center justify-center font-black shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <span className="absolute -top-1.5 -right-1.5 size-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-sanctuary-dark">
                {cartItems.length}
              </span>
            </div>

            <div className="truncate text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-white truncate">
                  {primaryItem?.name || 'Selected Service'}
                </span>
                {primaryItem?.subtitle && (
                  <span className="hidden sm:inline-block text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.2 rounded">
                    {primaryItem.subtitle}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-amber-200 font-bold truncate flex items-center gap-1">
                <span>📍 Book Online & Show In Store to Avail</span>
                {totalSavings > 0 && (
                  <span className="text-emerald-300 font-black">
                    • Save ₹{totalSavings}!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="text-right">
              <div className="text-base sm:text-xl font-black text-sanctuary-gold">
                ₹{totalAmount}
              </div>
              {totalOriginal > totalAmount && (
                <div className="text-[10px] text-white/60 line-through">
                  ₹{totalOriginal}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              className="py-2 px-3.5 sm:py-2.5 sm:px-5 bg-sanctuary-gold hover:bg-amber-300 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Checkout</span>
              <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickyCartBar;
