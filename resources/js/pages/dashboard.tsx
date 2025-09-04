import { Card, CardHeader, CardBody } from '@heroui/card';
import { Badge } from '@heroui/badge';
import { Button } from '@heroui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { isAdmin, getPrimaryRole } from '@/lib/auth';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const userRole = getPrimaryRole(user);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
                                <p className="text-gray-600">Here's what's happening with your account</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge
                                    color={userRole === 'super-admin' ? 'danger' : userRole === 'admin' ? 'warning' : 'primary'}
                                    variant="flat"
                                >
                                    {userRole}
                                </Badge>
                                {isAdmin(user) && (
                                    <Link href="/admin/dashboard">
                                        <Button color="primary" variant="flat" size="sm">
                                            Admin Panel
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Orders</p>
                                    <p className="text-3xl font-bold">0</p>
                                </div>
                                <div className="text-4xl opacity-80">📦</div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Favorite Items</p>
                                    <p className="text-3xl font-bold">0</p>
                                </div>
                                <div className="text-4xl opacity-80">❤️</div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Rewards Points</p>
                                    <p className="text-3xl font-bold">0</p>
                                </div>
                                <div className="text-4xl opacity-80">⭐</div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Quick Actions</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/">
                                <Button
                                    variant="flat"
                                    color="primary"
                                    className="w-full h-20 flex flex-col items-center justify-center"
                                >
                                    <span className="text-2xl mb-1">🍽️</span>
                                    <span>Browse Menu</span>
                                </Button>
                            </Link>

                            <Button
                                variant="flat"
                                color="secondary"
                                className="w-full h-20 flex flex-col items-center justify-center"
                                isDisabled
                            >
                                <span className="text-2xl mb-1">📦</span>
                                <span>My Orders</span>
                            </Button>

                            <Button
                                variant="flat"
                                color="success"
                                className="w-full h-20 flex flex-col items-center justify-center"
                                isDisabled
                            >
                                <span className="text-2xl mb-1">❤️</span>
                                <span>Favorites</span>
                            </Button>

                            <Link href="/settings/profile">
                                <Button
                                    variant="flat"
                                    color="warning"
                                    className="w-full h-20 flex flex-col items-center justify-center"
                                >
                                    <span className="text-2xl mb-1">⚙️</span>
                                    <span>Settings</span>
                                </Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>

                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Account Information</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Email:</span>
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Account Type:</span>
                                <Badge color="primary" variant="flat">
                                    {userRole}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Email Verified:</span>
                                <Badge
                                    color={user?.email_verified_at ? 'success' : 'warning'}
                                    variant="flat"
                                >
                                    {user?.email_verified_at ? 'Verified' : 'Unverified'}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Member Since:</span>
                                <span>
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('th-TH') : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AppLayout>
    );
}
