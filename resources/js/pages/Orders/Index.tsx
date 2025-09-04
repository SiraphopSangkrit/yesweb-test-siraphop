import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Order, PaginatedData, SharedData } from '@/types';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';

interface OrdersIndexProps extends SharedData {
    orders: PaginatedData<Order>;
}

export default function OrdersIndex() {
    const { orders } = usePage<OrdersIndexProps>().props;

    const formatPrice = (price: string | number) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
        }).format(numericPrice);
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'processing':
                return 'primary';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'danger';
            default:
                return 'default';
        }
    };

    return (
        <AppLayout>
            <div className="mt-5 flex justify-center">
                <Head title="My Orders" />

                <div className="w-full max-w-7xl space-y-6">
                    <Heading title="My Orders" description="View your order history and status" />
                    <div className='mt-2'>
                    <Link href="/">
                        <Button color="primary" >Start Shopping</Button>
                    </Link>


                    </div>
                    {orders.data.length === 0 ? (
                        <Card>
                            <CardBody className="py-12 text-center">
                                <div className="mb-4 text-6xl">📦</div>
                                <h3 className="mb-2 text-lg font-semibold">No orders yet</h3>
                                <p className="mb-4 text-gray-500">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                                <Link href="/">
                                    <Button color="primary">Start Shopping</Button>
                                </Link>
                            </CardBody>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <Card key={order.id}>
                                    <CardHeader>
                                        <div className="flex w-full items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Chip color={getStatusColor(order.status)} variant="flat" size="sm">
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Chip>
                                                <Link href={`/orders/${order.id}`}>
                                                    <Button size="sm" variant="flat" color="primary" startContent={<Eye className="h-4 w-4" />}>
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                                                </p>
                                                <div className="mt-2 flex gap-2">
                                                    {order.order_items.slice(0, 3).map((orderItem) => (
                                                        <div key={orderItem.id} className="flex items-center gap-2">
                                                            {orderItem.item.image && (
                                                                <img
                                                                    src={`/storage/${orderItem.item.image}`}
                                                                    alt={orderItem.item.name}
                                                                    className="h-8 w-8 rounded object-cover"
                                                                />
                                                            )}
                                                            <span className="text-sm">
                                                                {orderItem.item.name} x{orderItem.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {order.order_items.length > 3 && (
                                                        <span className="text-sm text-gray-500">+{order.order_items.length - 3} more</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-primary">{formatPrice(order.total_amount)}</p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}

                            {/* Pagination could be added here if needed */}
                            {orders.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex gap-2">
                                        {orders.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded border px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
