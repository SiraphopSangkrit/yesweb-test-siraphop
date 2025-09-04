import FoodItemCard from './food-item-card';
import { FoodItem } from '@/types';

interface FoodItemsGridProps {
    items: FoodItem[];
    onAddToCart?: (item: FoodItem) => void;
    onViewDetails?: (item: FoodItem) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    className?: string;
}

export default function FoodItemsGrid({
    items,
    onAddToCart,
    onViewDetails,
    isLoading = false,
    emptyMessage = "No food items available",
    className = ""
}: FoodItemsGridProps) {
    if (isLoading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
            {items.map((item) => (
                <FoodItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewDetails}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl"
                />
            ))}
        </div>
    );
}
