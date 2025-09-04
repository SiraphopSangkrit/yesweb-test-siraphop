import React from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal';
import { Input } from '@heroui/input';
import { Badge } from '@heroui/badge';
import { Chip } from '@heroui/chip';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { router } from '@inertiajs/react';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
    const { cart, updateCartItem, removeFromCart, clearCart, isLoading } = useCart();

    const formatPrice = (price: string | number) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(numericPrice);
    };

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
        } else {
            updateCartItem(itemId, newQuantity);
        }
    };

    const handleCheckout = () => {
        router.post('/cart/checkout', {}, {
            preserveState: false,
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <span>Shopping Cart ({cart.item_count} items)</span>
                    </div>
                </ModalHeader>
                <ModalBody>
                    {cart.items.length === 0 ? (
                        <div className="text-center py-8">
                            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500 text-lg">Your cart is empty</p>
                            <p className="text-gray-400 text-sm">Add some delicious items to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <Card key={item.id} className="p-0">
                                    <CardBody className="p-4">
                                        <div className="flex items-center gap-4">
                                            {item.image && (
                                                <img
                                                    src={`/storage/${item.image}`}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-lg truncate">{item.name}</h4>
                                                {item.category && (
                                                    <p className="text-sm text-gray-500">{item.category.name}</p>
                                                )}
                                                <p className="font-medium text-primary">{formatPrice(item.price)}</p>
                                                {!item.is_available && (
                                                    <Chip color="danger" size="sm" variant="flat">
                                                        Out of Stock
                                                    </Chip>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="flat"
                                                    onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    isDisabled={isLoading}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={item.quantity.toString()}
                                                    onChange={(e) => {
                                                        const newQuantity = parseInt(e.target.value) || 0;
                                                        handleQuantityChange(item.id, newQuantity);
                                                    }}
                                                    className="w-20"
                                                    min="0"
                                                    max="10"
                                                />
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="flat"
                                                    onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    isDisabled={isLoading || item.quantity >= 10}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    onPress={() => removeFromCart(item.id)}
                                                    isDisabled={isLoading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="text-right min-w-[80px]">
                                                <p className="font-semibold">
                                                    {formatPrice(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </ModalBody>
                {cart.items.length > 0 && (
                    <ModalFooter className="flex flex-col gap-4">
                        <div className="flex justify-between items-center w-full">
                            <Button
                                color="danger"
                                variant="flat"
                                onPress={clearCart}
                                isDisabled={isLoading}
                                startContent={<Trash2 className="h-4 w-4" />}
                            >
                                Clear Cart
                            </Button>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-primary">
                                    {formatPrice(cart.total)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="flat"
                                onPress={onClose}
                                className="flex-1"
                            >
                                Continue Shopping
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleCheckout}
                                isLoading={isLoading}
                                className="flex-1"
                            >
                                Checkout
                            </Button>
                        </div>
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    );
}

export function CartIcon() {
    const { cart } = useCart();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Badge
                content={cart.item_count > 99 ? '99+' : cart.item_count}
                color="danger"
                isInvisible={cart.item_count === 0}
                shape="circle"
            >
                <Button
                    isIconOnly
                    variant="flat"
                    onPress={onOpen}
                    className="relative"
                >
                    <ShoppingCart className="h-5 w-5" />
                </Button>
            </Badge>
            <CartModal isOpen={isOpen} onClose={onClose} />
        </>
    );
}
