<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use App\Models\Item;

class MainController extends Controller
{
    public function index(){
        $items = Item::with('category')
            ->where('is_available', true)
            ->latest()
            ->get();

        $cart = Session::get('cart', []);
        $cartData = $this->formatCartForResponse($cart);

        return Inertia::render('welcome', [
            'items' => $items,
            'cart' => $cartData
        ]);
    }

    public function menu(){
        $items = Item::with('category')
            ->where('is_available', true)
            ->latest()
            ->get();

        $cart = Session::get('cart', []);
        $cartData = $this->formatCartForResponse($cart);

        return Inertia::render('menu', [
            'items' => $items,
            'cart' => $cartData
        ]);
    }

    private function formatCartForResponse($cart)
    {
        $formattedCart = [];
        $total = 0;
        $itemCount = 0;

        foreach ($cart as $itemId => $item) {
            $subtotal = $item['price'] * $item['quantity'];
            $total += $subtotal;
            $itemCount += $item['quantity'];

            $formattedCart[] = [
                'id' => $item['id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'image' => $item['image'],
                'category' => $item['category'],
                'quantity' => $item['quantity'],
                'is_available' => $item['is_available'],
                'subtotal' => $subtotal
            ];
        }

        return [
            'items' => $formattedCart,
            'total' => $total,
            'item_count' => $itemCount
        ];
    }
}
