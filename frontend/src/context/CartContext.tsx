// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem?: string;
  tamanho?: string;
  cor?: string;
  lojistaId: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id && p.tamanho === item.tamanho && p.cor === item.cor);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id && p.tamanho === item.tamanho && p.cor === item.cor
            ? { ...p, quantidade: p.quantidade + item.quantidade }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}