import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Array<{
        id: number;
        name: string;
    }>;
    [key: string]: unknown; // This allows for additional properties...
}

export interface FoodItem {
    id: number;
    name: string;
    description: string;
    price: string | number;
    image?: string;
    category_id: number;
    category?: Category;
    rating?: number;
    is_available: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Category {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface CartItem extends FoodItem {
    quantity: number;
    total: number;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    user: User;
    order_items: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    item_id: number;
    quantity: number;
    price: string;
    created_at: string;
    updated_at: string;
    item: FoodItem;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
