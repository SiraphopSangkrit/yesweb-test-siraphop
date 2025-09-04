<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'make:admin {email} {name} {password}';

    /**
     * The console command description.
     */
    protected $description = 'Create an admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->argument('name');
        $password = $this->argument('password');

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'email' => $email,
                'password' => bcrypt($password),
                'email_verified_at' => now()
            ]
        );

        $user->assignRole('admin');

        $this->info("Admin user created successfully: {$user->email}");

        return 0;
    }
}
