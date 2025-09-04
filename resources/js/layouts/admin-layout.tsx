import { AdminSidebar } from '@/components/admin-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { useMemo } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: Array<{ title: string; href: string }>;
}

export function AdminLayout({ children, breadcrumbs }: AdminLayoutProps) {
    const { props, url } = usePage<SharedData>();
    const isOpen = props.sidebarOpen;

    // Generate breadcrumbs from current URL if not provided
    const defaultBreadcrumbs = useMemo(() => {
        if (breadcrumbs) return breadcrumbs;

        const segments = url.split('/').filter(Boolean);

        const breadcrumbItems = [
            { title: 'Dashboard', href: '/dashboard' }
        ];

        if (segments.length > 1) {
            segments.slice(1).forEach((segment, index) => {
                const href = '/' + segments.slice(0, index + 2).join('/');
                const title = segment.charAt(0).toUpperCase() + segment.slice(1);
                breadcrumbItems.push({ title, href });
            });
        }

        return breadcrumbItems;
    }, [breadcrumbs, url]);

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumbs breadcrumbs={defaultBreadcrumbs} />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        <div className="p-6 bg-background rounded-xl">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
