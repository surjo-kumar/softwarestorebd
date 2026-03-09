import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string; // product ID
    title: string;
    price: number;
    thumbnail_url: string;
    duration?: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: CartItem) => {
        setItems(current => {
            const existing = current.find(item => item.id === newItem.id);
            if (existing) {
                return current.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                        : item
                );
            }
            return [...current, { ...newItem, quantity: newItem.quantity || 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(current => current.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
