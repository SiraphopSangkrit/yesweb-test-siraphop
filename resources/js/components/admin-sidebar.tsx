import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    FolderOpen,

} from 'lucide-react';
import AppLogo from './app-logo';

interface AdminSidebarProps {
    className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
    const { url } = usePage();

    const adminNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            isActive: url === '/dashboard'
        },
        {
            title: 'Users',
            href: '/admin/users',
            icon: Users,
            isActive: url === '/admin/users'
        },
        {
            title: 'Categories',
            href: '/admin/categories',
            icon: FolderOpen,
            isActive: url === '/admin/categories'
        },
        {
            title: 'Items',
            href: '/admin/items',
            icon: Package,
            isActive: url === '/admin/items'
        },
        {
            title: 'Orders',
            href: '/admin/orders',
            icon: ShoppingCart,
            isActive: url === '/admin/orders'
        }
    ];


    return (
        <Sidebar collapsible="icon" variant="inset" className={className}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <div className="flex items-center gap-2">
                                    <AppLogo />
                                    <span className="font-semibold">Admin Panel</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarMenu>
                        {adminNavItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.isActive}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Management Navigation */}

            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
