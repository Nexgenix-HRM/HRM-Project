<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoticeController extends Controller
{
    // Get all published notices (for all users)
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Notice::with(['creator:id,name,role', 'recipients:id,name'])
            ->where('is_published', true)
            ->where(function ($query) use ($user) {
                $query->whereDoesntHave('recipients') // Broadcast (no specific recipients)
                      ->orWhereHas('recipients', function ($q) use ($user) {
                          $q->where('users.id', $user->id); // Targeted to me
                      });
            });

        // Dashboard specific filtering: Show only for 2 days
        if ($request->has('dashboard')) {
            $query->where('updated_at', '>=', now()->subDays(2));
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
