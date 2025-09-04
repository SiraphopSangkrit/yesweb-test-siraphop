# 🍜 YesWeb Thai Food Ordering System

A modern food ordering application built with Laravel 12, React 18, TypeScript, and Inertia.js. Features a complete shopping cart system, order management, and admin dashboard for managing menu items and orders.

## ✨ Features

### 🛒 Customer Features
- **Browse Menu**: View available food items with categories
- **Shopping Cart**: Add/remove items, update quantities, persistent cart
- **Order Management**: Place orders, view order history and details
- **User Authentication**: Secure login/registration system
- **Responsive Design**: Works seamlessly on desktop and mobile

### 👨‍💼 Admin Features
- **Dashboard**: Overview of orders, items, and users
- **Menu Management**: Create, edit, and delete food items and categories
- **Order Management**: View and update order statuses
- **User Management**: Manage user roles and permissions
- **Role-based Access**: Secure admin area with proper permissions

## 🛠️ Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, TypeScript, Inertia.js
- **UI Framework**: HeroUI (NextUI), Tailwind CSS
- **Database**: MySQL 
- **Icons**: Lucide React
- **Authentication**: Laravel Breeze
- **Authorization**: Spatie Laravel Permission

## 📋 Prerequisites

- PHP 8.2 or higher
- Node.js 18+ and npm
- Composer
- MySQL

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SiraphopSangkrit/yesweb-test-siraphop.git
   cd yesweb-test-siraphop
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   # Create database file (for SQLite)
   touch database/database.sqlite
   
   # Run migrations
   php artisan migrate
   
   # Seed the database with sample data
   php artisan db:seed
   ```

6. **Build frontend assets**
   ```bash
   npm run build
   # OR for development
   npm run dev
   ```

7. **Start the application**
   ```bash
   php artisan serve
   ```

   The application will be available at `http://localhost:8000`

## 🗄️ Database Structure

### Core Tables
- **users**: User accounts and authentication
- **categories**: Food categories (Appetizers, Main Dishes, etc.)
- **items**: Food items with prices and descriptions
- **orders**: Customer orders
- **order_items**: Items within each order
- **roles & permissions**: User role management

## 🔐 Default Users

After seeding, you can login with:

**Super Admin User:**
- Email: `superadmin@example.com`
- Password: `superyesweb`


**Admin User:**
- Email: `admin@example.com`
- Password: `adminyesweb`



## 🛣️ API Routes

### Public Routes
- `GET /` - Homepage with featured items
- `GET /menu` - Full menu page
- `POST /cart/add` - Add item to cart
- `GET /cart` - Get cart contents
- `PATCH /cart/update` - Update cart item quantity
- `DELETE /cart/remove` - Remove item from cart

### Authenticated Routes
- `POST /cart/checkout` - Checkout and create order
- `GET /orders` - View order history
- `GET /orders/{order}` - View order details

### Admin Routes (requires admin role)
- `GET /dashboard` - Admin dashboard
- `GET /admin/items` - Manage menu items
- `GET /admin/categories` - Manage categories
- `GET /admin/orders` - Manage all orders
- `GET /admin/users` - Manage users

## 🏗️ Project Structure

```
app/
├── Http/Controllers/
│   ├── CartController.php      # Cart operations
│   ├── OrderController.php     # Order management
│   ├── MainController.php      # Public pages
│   └── Admin/
│       └── AdminController.php # Admin operations
├── Models/
│   ├── User.php
│   ├── Category.php
│   ├── Item.php
│   ├── Order.php
│   └── OrderItem.php
└── Http/Middleware/
    └── AdminMiddleware.php     # Admin access control

resources/js/
├── components/
│   ├── Cart.tsx               # Cart modal and icon
│   ├── food-item-card.tsx     # Individual food item
│   └── food-items-grid.tsx    # Grid of food items
├── contexts/
│   └── CartContext.tsx        # Cart state management
├── pages/
│   ├── welcome.tsx            # Homepage
│   ├── menu.tsx               # Menu page
│   ├── Orders/
│   │   ├── Index.tsx          # Order history
│   │   └── Show.tsx           # Order details
│   └── admin/                 # Admin pages
└── types/
    └── index.d.ts             # TypeScript definitions
```

## 🎯 Usage

### For Customers
1. Browse the homepage or menu page
2. Click "Add to Cart" on desired items
3. View cart by clicking the cart icon
4. Adjust quantities or remove items as needed
5. Click "Checkout" to place order (requires login)
6. View order status in "My Orders"

### For Admins
1. Login with admin credentials
2. Access admin dashboard via "Dashboard" link
3. Manage menu items in the Items section
4. View and update order statuses
5. Manage user roles and permissions

## 🔧 Configuration

### Cart Settings
- Cart data is stored in PHP sessions
- Cart persists across page reloads
- Maximum quantity per item: 10
- Guest users can add to cart (checkout requires login)

### Order Status Flow
- `pending` → `processing` → `completed`
- Orders can be cancelled if status is `pending`

### Role Permissions
- **Customer**: Can place orders, view own orders
- **Admin**: Can manage items, categories, view all orders
- **Super Admin**: Full system access

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run frontend tests
npm run test
```

## 🚀 Deployment

1. **Production environment**
   ```bash
   cp .env.example .env.production
   # Configure production database and settings
   ```

2. **Build assets**
   ```bash
   npm run build
   ```

3. **Optimize Laravel**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Set permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Cart not updating:**
- Check browser console for JavaScript errors
- Ensure CSRF token is properly set in meta tag
- Verify session configuration in `config/session.php`

**Orders not appearing:**
- Ensure user is properly authenticated
- Check database foreign key constraints
- Verify order creation in Laravel logs

**Admin access denied:**
- Confirm user has admin role assigned
- Check `AdminMiddleware` configuration
- Verify role seeding completed successfully

**Build errors:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript compilation: `npx tsc --noEmit`

### Performance Optimization

**Frontend:**
- Images are optimized and served from storage
- Components use React.memo where appropriate
- Cart state is efficiently managed with context

**Backend:**
- Database queries use eager loading (`with()`)
- Pagination implemented for large datasets
- Cart data cached in sessions


