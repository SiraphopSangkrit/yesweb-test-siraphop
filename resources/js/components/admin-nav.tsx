import { Link, usePage } from '@inertiajs/react';

interface AdminNavItem {
    name: string;
    href: string;
    icon: string;
    isActive?: boolean;
}

export default function AdminNav() {
    const { url } = usePage();

    const adminNavItems: AdminNavItem[] = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: '📊',
            isActive: url === '/dashboard'
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: '👥',
            isActive: url === '/admin/users'
        },
        {
            name: 'Items',
            href: '/admin/items',
            icon: '🍽️',
            isActive: url === '/admin/items'
        },
        {
            name: 'Orders',
            href: '/admin/orders',
            icon: '📦',
            isActive: url === '/admin/orders'
        },
        {
            name: 'Categories',
            href: '/admin/categories',
            icon: '📂',
            isActive: url === '/admin/categories'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8">
                    {adminNavItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                item.isActive
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
