<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{

    public function index()
    {
        $orders = Order::with(['orderItems.item', 'user'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['orderItems.item.category', 'user']);

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }
}
