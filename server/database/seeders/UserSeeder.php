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
        User::updateOrCreate(
            ['email' => 'ceo@nexgenix.com'],
            [
                'name' => 'CEO Administrative',
                'password' => Hash::make('password'),
                'role' => 'ceo',
            ]
        );

        // HR
        User::updateOrCreate(
            ['email' => 'hr@nexgenix.com'],
            [
                'name' => 'HR Manager',
                'password' => Hash::make('password'),
                'role' => 'hr',
            ]
        );

        // Employee
        User::updateOrCreate(
            ['email' => 'employee@nexgenix.com'],
            [
                'name' => 'Regular Employee',
                'password' => Hash::make('password'),
                'role' => 'employee',
            ]
        );
    }
}
