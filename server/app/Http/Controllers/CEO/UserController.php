<?php

namespace App\Http\Controllers\CEO;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $currentUser = $request->user();
        
        $roleValidation = 'required|in:ceo,hr,employee';
        if ($currentUser->role === 'hr') {
            $roleValidation = 'required|in:employee';
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => $roleValidation,
            'designation' => 'nullable|string|max:255',
            'mobile_number' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'designation' => $request->designation,
            'mobile_number' => $request->mobile_number,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }
    public function destroy(Request $request, $id)
    {
        $userToDelete = User::findOrFail($id);
        $currentUser = $request->user();

        // 1. Prevent self-deletion
        if ($currentUser->id == $userToDelete->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        // 2. HR role restrictions
        if ($currentUser->role === 'hr' && $userToDelete->role !== 'employee') {
            return response()->json(['message' => 'HR can only delete employees.'], 403);
        }

        $userToDelete->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }
}
