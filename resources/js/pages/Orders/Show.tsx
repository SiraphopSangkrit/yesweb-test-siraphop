import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Order, SharedData } from '@/types';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface OrderShowProps extends SharedData {
    order: Order;
}

export default function OrderShow() {
    const { order } = usePage<OrderShowProps>().props;

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
            month: 'long',
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
            <div className="flex justify-center mt-5">
                <Head title={`Order #${order.id}`} />

                <div className="space-y-6 w-full max-w-7xl">
                    <div className="flex items-center gap-4">
                        <Link href="/orders">
                            <Button variant="flat" startContent={<ArrowLeft className="h-4 w-4" />}>
                                Back to Orders
                            </Button>
                        </Link>
                        <Heading title={`Order #${order.id}`} description={`Placed on ${formatDate(order.created_at)}`} />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Order Details */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Order Status */}
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">Order Status</h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Current Status</p>
                                            <Chip color={getStatusColor(order.status)} variant="flat" size="lg" className="mt-1">
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Chip>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Order Date</p>
                                            <p className="font-medium">{formatDate(order.created_at)}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">Order Items ({order.order_items.length})</h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-4">
                                        {order.order_items.map((orderItem) => (
                                            <div key={orderItem.id} className="flex items-center gap-4 rounded-lg border p-4">
                                                {orderItem.item.image && (
                                                    <img
                                                        src={`/storage/${orderItem.item.image}`}
                                                        alt={orderItem.item.name}
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{orderItem.item.name}</h4>
                                                    {orderItem.item.category && (
                                                        <p className="text-sm text-gray-500">{orderItem.item.category.name}</p>
                                                    )}
                                                    <p className="mt-1 text-sm text-gray-600">{orderItem.item.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatPrice(orderItem.price)} × {orderItem.quantity}
                                                    </p>
                                                    <p className="text-lg font-bold text-primary">
                                                        {formatPrice(parseFloat(orderItem.price) * orderItem.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">Order Summary</h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(order.total_amount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Delivery Fee</span>
                                            <span>Free</span>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">{formatPrice(order.total_amount)}</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">Customer Information</h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-medium">{order.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{order.user.email}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Actions */}
                            {order.status === 'pending' && (
                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold">Actions</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="space-y-2">
                                            <Button
                                                color="danger"
                                                variant="flat"
                                                fullWidth
                                                onPress={() => {
                                                    // Implement order cancellation
                                                    alert('Order cancellation feature coming soon!');
                                                }}
                                            >
                                                Cancel Order
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
