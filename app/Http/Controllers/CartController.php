<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use App\Models\Item;
use App\Models\Order;
use App\Models\OrderItem;
use Inertia\Inertia;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1|max:10'
        ]);

        $item = Item::with('category')->findOrFail($request->item_id);

        if (!$item->is_available) {
            return back()->with('error', 'This item is currently unavailable.');
        }

        $cart = Session::get('cart', []);
        $itemId = $request->item_id;

        if (isset($cart[$itemId])) {
            $cart[$itemId]['quantity'] += $request->quantity;
        } else {
            $cart[$itemId] = [
                'id' => $item->id,
                'name' => $item->name,
                'price' => $item->price,
                'image' => $item->image,
                'category' => $item->category,
                'quantity' => $request->quantity,
                'is_available' => $item->is_available
            ];
        }

        Session::put('cart', $cart);

        return back()->with('success', "{$item->name} added to cart!");
    }

    public function updateCartItem(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer',
            'quantity' => 'required|integer|min:0|max:10'
        ]);

        $cart = Session::get('cart', []);
        $itemId = $request->item_id;

        if ($request->quantity == 0) {
            unset($cart[$itemId]);
        } else {
            if (isset($cart[$itemId])) {
                $cart[$itemId]['quantity'] = $request->quantity;
            }
        }

        Session::put('cart', $cart);

        return response()->json([
            'message' => 'Cart updated successfully',
            'cart' => $this->formatCartForResponse($cart)
        ]);
    }

    public function removeFromCart(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer'
        ]);

        $cart = Session::get('cart', []);
        unset($cart[$request->item_id]);
        Session::put('cart', $cart);

        return response()->json([
            'message' => 'Item removed from cart',
            'cart' => $this->formatCartForResponse($cart)
        ]);
    }

    public function getCart()
    {
        $cart = Session::get('cart', []);
        return response()->json([
            'cart' => $this->formatCartForResponse($cart)
        ]);
    }

    public function clearCart()
    {
        Session::forget('cart');
        return response()->json(['message' => 'Cart cleared successfully']);
    }

    public function checkout(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to place an order.');
        }

        $cart = Session::get('cart', []);

        if (empty($cart)) {
            return back()->with('error', 'Your cart is empty.');
        }

        // Validate cart items are still available
        foreach ($cart as $itemId => $cartItem) {
            $item = Item::find($itemId);
            if (!$item || !$item->is_available) {
                unset($cart[$itemId]);
                Session::put('cart', $cart);
                return back()->with('error', "Item {$cartItem['name']} is no longer available.");
            }
        }

        // Calculate total
        $total = 0;
        foreach ($cart as $cartItem) {
            $total += $cartItem['price'] * $cartItem['quantity'];
        }

        // Create order
        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => $total,
            'status' => 'pending'
        ]);

        // Create order items
        foreach ($cart as $itemId => $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'item_id' => $itemId,
                'quantity' => $cartItem['quantity'],
                'price' => $cartItem['price']
            ]);
        }

        // Clear cart
        Session::forget('cart');

        return redirect()->route('orders.show', $order->id)->with('success', 'Order placed successfully!');
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
