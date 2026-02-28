<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-user', function () {
    $user = \App\Models\User::where('email', 'employee@example.com')->first();
    if (!$user) return 'User Not Found';
    
    $check = \Illuminate\Support\Facades\Hash::check('password', $user->password);
    return response()->json([
        'user' => $user,
        'password_check' => $check ? 'MATCH' : 'MISMATCH'
    ]);
});
