<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'designation', 'mobile_number', 'profile_image')
            ->get();

        // Group by role manually to maintain specific order if needed, or just return all and group in frontend
        return response()->json($users);
    }
}
