<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MainController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

// Public routes (accessible without authentication)
Route::get('/', [MainController::class, 'index'])->name('home');
Route::get('/menu', [MainController::class, 'menu'])->name('menu');

// Cart routes
Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
Route::get('/cart', [CartController::class, 'getCart'])->name('cart.get');
Route::patch('/cart/update', [CartController::class, 'updateCartItem'])->name('cart.update');
Route::delete('/cart/remove', [CartController::class, 'removeFromCart'])->name('cart.remove');
Route::delete('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

// Admin routes - require admin role
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('users', [AdminController::class, 'users'])->name('users');
        Route::patch('users/{user}/role', [AdminController::class, 'updateUserRole'])->name('users.role');
        Route::get('items', [AdminController::class, 'items'])->name('items');
        Route::post('items', [AdminController::class, 'storeItem'])->name('items.store');
        Route::put('items/{item}', [AdminController::class, 'updateItem'])->name('items.update');
        Route::delete('items/{item}', [AdminController::class, 'destroyItem'])->name('items.destroy');
        Route::get('orders', [AdminController::class, 'orders'])->name('orders');
        Route::patch('orders/{order}/status', [AdminController::class, 'updateOrderStatus'])->name('orders.status');
        Route::get('categories', [AdminController::class, 'categories'])->name('categories');
        Route::post('categories', [AdminController::class, 'storeCategory'])->name('categories.store');
        Route::put('categories/{category}', [AdminController::class, 'updateCategory'])->name('categories.update');
        Route::delete('categories/{category}', [AdminController::class, 'destroyCategory'])->name('categories.destroy');


    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
