import { CartIcon } from '@/components/Cart';
import FoodItemsGrid from '@/components/food-items-grid';
import { Cart, CartProvider, useCart } from '@/contexts/CartContext';
import { isAdmin } from '@/lib/auth';
import { dashboard, login, logout } from '@/routes';
import { type SharedData, FoodItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface WelcomeProps extends SharedData {
    items: FoodItem[];
    cart: Cart;
}

export default function Welcome() {
    const { auth, items, cart } = usePage<WelcomeProps>().props;

    return (
        <CartProvider initialCart={cart}>
            <WelcomeContent auth={auth} items={items} />
        </CartProvider>
    );
}

function WelcomeContent({ auth, items }: { auth: SharedData['auth']; items: FoodItem[] }) {
    const { addToCart } = useCart();

    const handleAddToCart = (item: FoodItem) => {
        addToCart(item.id, 1);
    };

    const handleViewDetails = (item: FoodItem) => {
        console.log('Viewing details for:', item);
        // Here you would navigate to the item details page
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                                {isAdmin(auth.user) && (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/orders"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    My Orders
                                </Link>

                                <Link
                                    href={logout()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/orders"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    My Orders
                                </Link>
                            </>
                        )}
                        <CartIcon />
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="mx-auto flex w-full max-w-7xl flex-col space-y-8">
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="mb-2 text-2xl font-bold text-gray-800">Food Order</h2>
                            </div>

                            <FoodItemsGrid items={items} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
