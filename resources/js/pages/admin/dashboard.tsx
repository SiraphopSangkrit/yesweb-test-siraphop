import { AdminLayout } from '@/layouts/admin-layout';
import Heading from '@/components/heading';
import { Badge } from '@heroui/badge';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Head } from '@inertiajs/react';

interface AdminDashboardProps {
    stats: {
        total_users: number;
        total_items: number;
        total_orders: number;
        total_categories: number;
        recent_orders: Array<{
            id: number;
            total_amount: string;
            user: {
                name: string;
                email: string;
            };
            created_at: string;
        }>;
        recent_users: Array<{
            id: number;
            name: string;
            email: string;
            created_at: string;
        }>;
    };
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminLayout>

                <Head title="Admin Dashboard" />

                <div className="space-y-6">
                    <Heading title="Admin Dashboard" description="Overview of your application statistics and recent activity" />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <CardBody className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-100">Total Users</p>
                                        <p className="text-3xl font-bold">{stats.total_users}</p>
                                    </div>
                                    <div className="text-4xl opacity-80">👥</div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <CardBody className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-100">Total Items</p>
                                        <p className="text-3xl font-bold">{stats.total_items}</p>
                                    </div>
                                    <div className="text-4xl opacity-80">🍽️</div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <CardBody className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-orange-100">Total Orders</p>
                                        <p className="text-3xl font-bold">{stats.total_orders}</p>
                                    </div>
                                    <div className="text-4xl opacity-80">📦</div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <CardBody className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-100">Categories</p>
                                        <p className="text-3xl font-bold">{stats.total_categories}</p>
                                    </div>
                                    <div className="text-4xl opacity-80">📂</div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Recent Orders</h3>
                            </CardHeader>
                            <CardBody>
                                {stats.recent_orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.recent_orders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div>
                                                    <p className="font-medium">Order #{order.id}</p>
                                                    <p className="text-sm text-gray-600">{order.user.name}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                                </div>
                                                <Badge color="success" variant="flat">
                                                    {formatCurrency(order.total_amount)}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-8 text-center text-gray-500">No recent orders</p>
                                )}
                            </CardBody>
                        </Card>

                        {/* Recent Users */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Recent Users</h3>
                            </CardHeader>
                            <CardBody>
                                {stats.recent_users.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.recent_users.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(user.created_at)}</p>
                                                </div>
                                                <Badge color="primary" variant="flat">
                                                    New
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-8 text-center text-gray-500">No recent users</p>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>

        </AdminLayout>
    );
}
