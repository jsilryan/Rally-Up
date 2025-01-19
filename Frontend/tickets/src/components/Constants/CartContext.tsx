import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types
interface Ticket {
  count: number;
  price: number;
}

export interface CartItem {
  eventId: string;
  tickets: Record<string, Ticket>;
  link: string;
}

interface CartContextType {
  cart: CartItem[];
  setCart: (cartItems: CartItem[]) => void;
  updateCart: (newEvent: CartItem) => void;
  clearCart: () => void; // Add this
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage if it exists
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateCart = (newEvent: CartItem) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const index = updatedCart.findIndex((item) => item.eventId === newEvent.eventId);

      if (index === -1) {
        updatedCart.push(newEvent);
      } else {
        updatedCart[index] = newEvent;
      }

      return updatedCart;
    });
  };

  // Function to clear the cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, setCart, updateCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
