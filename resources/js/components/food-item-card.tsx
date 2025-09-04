import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { FoodItem } from "@/types";


interface FoodItemCardProps {
    item: FoodItem;
    onAddToCart?: (item: FoodItem) => void;
    onViewDetails?: (item: FoodItem) => void;
    className?: string;
}

export default function FoodItemCard({
    item,
    onAddToCart,
    onViewDetails,
    className = ""
}: FoodItemCardProps) {


    const formatPrice = (price: string | number) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(numericPrice);
    };

    const handleAddToCart = () => {
        if (item.is_available === false) {
            return;
        }

        // Use cart context instead of prop function
        if (onAddToCart) {
            onAddToCart(item);
        }
    };

    const handleCardClick = () => {
        if (onViewDetails) {
            onViewDetails(item);
        }
    };

    return (
        <Card
            className={`w-full max-w-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
            isPressable
            onPress={handleCardClick}
        >
            <CardHeader className="pb-0">
                <div className="flex justify-center items-center p-4">


                {item.image ? (
                    <Image
                    alt={item.name}
                    className="object-cover rounded-lg"
                    src={`/storage/${item.image}`}
                    width="100%"
                    height={200}
                    />
                ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-gray-400 text-4xl">🍽️</div>
                    </div>
                )}
                </div>
            </CardHeader>

            <CardBody className="px-4 py-2">
                    <h2>{item.category?.name}</h2>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {item.name}
                    </h3>

                </div>

                {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {item.description}
                    </p>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">
                        {formatPrice(item.price)}
                    </span>
                </div>
            </CardBody>

            <CardFooter className="pt-0">
                <Button
                    color="primary"
                    variant="solid"
                    fullWidth
                    onPress={handleAddToCart}
                    isDisabled={item.is_available === false}
                    className="font-medium"
                >
                    {item.is_available === false ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </CardFooter>
        </Card>
    );
}
