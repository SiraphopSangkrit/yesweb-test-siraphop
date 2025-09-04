<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $customerRole = Role ::firstOrCreate(['name'=> 'customer']);

        // Create permissions
        $permissions = [
            'manage users',
            'manage items',
            'manage orders',
            'manage categories',
            'view admin dashboard',
            'manage roles',
            'manage permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign all permissions to super admin role
        $superAdminRole->syncPermissions($permissions);

        // Assign specific permissions to admin role
        $adminRole->syncPermissions([
            'manage items',
            'manage orders',
            'manage categories',
            'view admin dashboard'
        ]);

        // Create admin user if doesn't exist
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('adminyesweb'),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role to admin user
        $adminUser->assignRole('admin');

        // Create super admin user if doesn't exist
        $superAdminUser = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin User',
                'password' => Hash::make('superyesweb'),
                'email_verified_at' => now(),
            ]
        );

        // Assign super admin role
        $superAdminUser->assignRole('super-admin');

    }
}
