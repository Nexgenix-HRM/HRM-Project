<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // CEO
        User::create([
            'name' => 'CEO Administrative',
            'email' => 'ceo@nexgenix.com',
            'password' => Hash::make('password'),
            'role' => 'ceo',
        ]);

        // HR
        User::create([
            'name' => 'HR Manager',
            'email' => 'hr@nexgenix.com',
            'password' => Hash::make('password'),
            'role' => 'hr',
        ]);

        // Employee
        User::create([
            'name' => 'Regular Employee',
            'email' => 'employee@nexgenix.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);
    }
}
