<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Item;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_items' => Item::count(),
            'total_orders' => Order::count(),
            'total_categories' => Category::count(),
            'recent_orders' => Order::with('user')
                ->latest()
                ->take(5)
                ->get(),
            'recent_users' => User::latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats
        ]);
    }

    /**
     * Display user management page.
     */
    public function users(): Response
    {
        $users = User::with('roles')
            ->latest()
            ->paginate(20);

        $roles = Role::all();

        return Inertia::render('admin/users', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    /**
     * Update user role.
     */
    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name'
        ]);

        // Remove all current roles and assign new one
        $user->syncRoles([$request->role]);

        return back()->with('success', 'User role updated successfully.');
    }

    /**
     * Display item management page.
     */
    public function items(): Response
    {
        $items = Item::with('category')
            ->latest()
            ->paginate(20);

        $categories = Category::all();

        return Inertia::render('admin/items', [
            'items' => $items,
            'categories' => $categories
        ]);
    }

    /**
     * Display order management page.
     */
    public function orders(): Response
    {
        $orders = Order::with(['user', 'orderItems.item'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/orders', [
            'orders' => $orders
        ]);
    }

    /**
     * Update order status.
     */
    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Display category management page.
     */
    public function categories(): Response
    {
        $categories = Category::withCount('items')
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/categories', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a new category.
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name'
        ]);

        Category::create([
            'name' => $request->name
        ]);

        return back()->with('success', 'Category created successfully.');
    }

    /**
     * Update a category.
     */
    public function updateCategory(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id
        ]);

        $category->update([
            'name' => $request->name
        ]);

        return back()->with('success', 'Category updated successfully.');
    }

    /**
     * Delete a category.
     */
    public function destroyCategory(Category $category)
    {
        // Check if category has items
        if ($category->items()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete category that has items.']);
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }

    /**
     * Store a new item.
     */
    public function storeItem(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_available' => 'boolean',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'is_available' => $request->boolean('is_available', true)
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('items', 'public');
        }

        Item::create($data);

        return back()->with('success', 'Item created successfully.');
    }

    /**
     * Update an item.
     */
    public function updateItem(Request $request, Item $item)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_available' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'is_available' => $request->boolean('is_available', true)
        ];

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            $data['image'] = $request->file('image')->store('items', 'public');
        }

        $item->update($data);

        return back()->with('success', 'Item updated successfully.');
    }

    /**
     * Delete an item.
     */
    public function destroyItem(Item $item)
    {
        // Delete image if exists
        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();

        return back()->with('success', 'Item deleted successfully.');
    }
}
