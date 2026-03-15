"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "valemonte_cart";

function loadCart() {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        setItems(loadCart());
        setLoaded(true);
    }, []);

    // Persist on change
    useEffect(() => {
        if (loaded) saveCart(items);
    }, [items, loaded]);

    const addItem = useCallback((product) => {
        // product: { id, variantId, name, size, price, imageUrl, slug }
        setItems((prev) => {
            const existing = prev.find(
                (i) => i.id === product.id && i.variantId === product.variantId
            );
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id && i.variantId === product.variantId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((variantId) => {
        setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    }, []);

    const updateQuantity = useCallback((variantId, quantity) => {
        if (quantity < 1) {
            setItems((prev) => prev.filter((i) => i.variantId !== variantId));
            return;
        }
        setItems((prev) =>
            prev.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart, loaded }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
