import { Head } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { Chip } from '@heroui/chip';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { Search, Eye, Edit } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Order, PaginatedData } from '@/types';

interface OrderManagementProps {
    orders: PaginatedData<Order>;
}

export default function OrderManagement({ orders }: OrderManagementProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isStatusOpen, onOpen: onStatusOpen, onClose: onStatusClose } = useDisclosure();

    const { data: statusData, setData: setStatusData, patch, processing, errors } = useForm({
        status: '',
    });

    const statusOptions = [
        { key: 'all', label: 'All Status' },
        { key: 'pending', label: 'Pending' },
        { key: 'processing', label: 'Processing' },
        { key: 'completed', label: 'Completed' },
        { key: 'cancelled', label: 'Cancelled' },
    ];

    const filteredOrders = orders.data.filter(order => {
        const matchesSearch =
            order.id.toString().includes(searchTerm) ||
            order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string): "default" | "warning" | "primary" | "success" | "danger" => {
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

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        onViewOpen();
    };

    const handleEditStatus = (order: Order) => {
        setSelectedOrder(order);
        setStatusData('status', order.status);
        onStatusOpen();
    };

    const handleStatusUpdate = () => {
        if (!selectedOrder) return;

        patch(`/admin/orders/${selectedOrder.id}/status`, {
            onSuccess: () => {
                onStatusClose();
                setSelectedOrder(null);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Order Management" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Heading
                        title="Order Management"
                        description="Manage customer orders and update their status"
                    />
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <h2 className="text-xl font-semibold">Orders ({orders.total})</h2>
                        <div className="flex gap-4 items-center">
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startContent={<Search className="h-4 w-4" />}
                                className="w-64"
                            />
                            <Select
                                placeholder="Filter by status"
                                selectedKeys={[statusFilter]}
                                onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                                className="w-48"
                            >
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Table aria-label="Orders table">
                            <TableHeader>
                                <TableColumn>ORDER ID</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>ITEMS</TableColumn>
                                <TableColumn>TOTAL</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>DATE</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="No orders found">
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.user.name}</span>
                                                <span className="text-small text-gray-500">{order.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-small">
                                                {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(order.total_amount)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={getStatusColor(order.status)}
                                                variant="flat"
                                                size="sm"
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="text-small">
                                            {formatDate(order.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                    startContent={<Eye className="h-4 w-4" />}
                                                    onPress={() => handleViewOrder(order)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="warning"
                                                    startContent={<Edit className="h-4 w-4" />}
                                                    onPress={() => handleEditStatus(order)}
                                                >
                                                    Status
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                {/* View Order Modal */}
                <Modal
                    isOpen={isViewOpen}
                    onClose={onViewClose}
                    size="3xl"
                    scrollBehavior="inside"
                >
                    <ModalContent>
                        <ModalHeader>
                            <h3>Order Details - #{selectedOrder?.id}</h3>
                        </ModalHeader>
                        <ModalBody>
                            {selectedOrder && (
                                <div className="space-y-6">
                                    {/* Customer Information */}
                                    <div>
                                        <h4 className="font-semibold mb-2">Customer Information</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                            <p><span className="font-medium">Name:</span> {selectedOrder.user.name}</p>
                                            <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                                            <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.created_at)}</p>
                                            <p>
                                                <span className="font-medium">Status:</span>{' '}
                                                <Chip
                                                    color={getStatusColor(selectedOrder.status)}
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                                </Chip>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="font-semibold mb-2">Order Items</h4>
                                        <div className="space-y-2">
                                            {selectedOrder.order_items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.item.name}</p>
                                                        <p className="text-small text-gray-500">
                                                            {formatCurrency(item.price)} × {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">
                                                            {formatCurrency((parseFloat(item.price) * item.quantity).toString())}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                            <span className="font-semibold text-lg">Total:</span>
                                            <span className="font-bold text-lg">
                                                {formatCurrency(selectedOrder.total_amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onViewClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Update Status Modal */}
                <Modal
                    isOpen={isStatusOpen}
                    onClose={onStatusClose}
                    size="md"
                >
                    <ModalContent>
                        <ModalHeader>
                            <h3>Update Order Status - #{selectedOrder?.id}</h3>
                        </ModalHeader>
                        <ModalBody>
                            <Select
                                label="Order Status"
                                placeholder="Select status"
                                selectedKeys={[statusData.status]}
                                onSelectionChange={(keys) => setStatusData('status', Array.from(keys)[0] as string)}
                                errorMessage={errors.status}
                                isInvalid={!!errors.status}
                            >
                                <SelectItem key="pending">Pending</SelectItem>
                                <SelectItem key="processing">Processing</SelectItem>
                                <SelectItem key="completed">Completed</SelectItem>
                                <SelectItem key="cancelled">Cancelled</SelectItem>
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="flat"
                                onPress={onStatusClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleStatusUpdate}
                                isLoading={processing}
                            >
                                Update Status
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </AdminLayout>
    );
}
