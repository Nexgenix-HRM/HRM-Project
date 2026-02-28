<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Todo;
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $today = Carbon::today();

        $attendance = Attendance::where('user_id', $userId)->where('date', $today)->first();
        $pendingTodos = Todo::where('user_id', $userId)->where('is_completed', false)->count();
        $pendingLeaves = \App\Models\LeaveRequest::where('user_id', $userId)->where('status', 'pending')->count();

        return response()->json([
            'attendance_status' => $attendance ? ($attendance->check_out ? 'Checked Out' : 'Checked In') : 'Absent',
            'check_in_time' => $attendance ? $attendance->check_in : null,
            'check_out_time' => $attendance ? $attendance->check_out : null,
            'pending_todos' => $pendingTodos,
            'pending_leaves' => $pendingLeaves,
        ]);
    }
}
