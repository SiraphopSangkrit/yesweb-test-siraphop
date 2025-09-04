import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { FoodItem, SharedData } from '@/types';
import FoodItemsGrid from '@/components/food-items-grid';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { CartProvider, Cart, useCart } from '@/contexts/CartContext';

interface MenuPageProps extends SharedData {
    items: FoodItem[];
    cart: Cart;
}

export default function Menu() {
    const { items, cart } = usePage<MenuPageProps>().props;

    return (
        <CartProvider initialCart={cart}>
            <MenuContent items={items} />
        </CartProvider>
    );
}

function MenuContent({ items }: { items: FoodItem[] }) {
    const { addToCart } = useCart();

    const handleAddToCart = (item: FoodItem) => {
        addToCart(item.id, 1);
    };


    return (
        <AppLayout>
            <Head title="Menu" />

            <div className="space-y-6">
                <Heading
                    title="Food Menu"
                    description="Browse our delicious selection of Thai cuisine"
                />

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <FoodItemsGrid
                        items={items}
                        onAddToCart={handleAddToCart}

                        isLoading={false}
                        emptyMessage="No menu items available at the moment"
                        className="mt-6"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
