import React, { createContext, useContext, useState, ReactNode } from 'react';
import { router } from '@inertiajs/react';
import { Category } from '@/types';

export interface CartItem {
    id: number;
    name: string;
    price: string | number;
    image?: string;
    category?: Category;
    quantity: number;
    is_available: boolean;
    subtotal: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
    item_count: number;
}

interface CartContextType {
    cart: Cart;
    addToCart: (itemId: number, quantity?: number) => void;
    updateCartItem: (itemId: number, quantity: number) => void;
    removeFromCart: (itemId: number) => void;
    clearCart: () => void;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
    initialCart?: Cart;
}

export function CartProvider({ children, initialCart }: CartProviderProps) {
    const [cart, setCart] = useState<Cart>(initialCart || { items: [], total: 0, item_count: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const fetchCart = async () => {
        try {
            const response = await fetch('/cart');
            const data = await response.json();
            setCart(data.cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = (itemId: number, quantity: number = 1) => {
        setIsLoading(true);
        router.post('/cart/add', {
            item_id: itemId,
            quantity: quantity
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                fetchCart();
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const updateCartItem = async (itemId: number, quantity: number) => {
        setIsLoading(true);
        try {
            const response = await fetch('/cart/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    item_id: itemId,
                    quantity: quantity
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (itemId: number) => {
        setIsLoading(true);
        try {
            const response = await fetch('/cart/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    item_id: itemId
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/cart/clear', {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                setCart({ items: [], total: 0, item_count: 0 });
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateCartItem,
            removeFromCart,
            clearCart,
            isLoading
        }}>
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
