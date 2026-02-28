<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        return Attendance::where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->take(30) // Last 30 days
            ->get();
    }

    public function status()
    {
        $today = Carbon::today()->toDateString();
        $attendance = Attendance::where('user_id', Auth::id())
            ->where('date', $today)
            ->first();

        return response()->json([
            'status' => $attendance ? ($attendance->check_out ? 'checked_out' : 'checked_in') : 'not_checked_in',
            'attendance' => $attendance
        ]);
    }

    public function checkIn(Request $request)
    {
        $today = Carbon::today()->toDateString();
        $existing = Attendance::where('user_id', Auth::id())->where('date', $today)->first();

        if ($existing) {
            return response()->json(['message' => 'Already checked in today'], 400);
        }

        $attendance = Attendance::create([
            'user_id' => Auth::id(),
            'date' => $today,
            'check_in' => Carbon::now()->toTimeString(),
            'status' => 'present'
        ]);

        return response()->json(['message' => 'Checked in successfully', 'attendance' => $attendance]);
    }

    public function checkOut(Request $request)
    {
        $today = Carbon::today()->toDateString();
        $attendance = Attendance::where('user_id', Auth::id())->where('date', $today)->first();

        if (!$attendance) {
            return response()->json(['message' => 'No attendance record for today'], 400);
        }

        if ($attendance->check_out) {
             return response()->json(['message' => 'Already checked out'], 400);
        }

        $attendance->update([
            'check_out' => Carbon::now()->toTimeString()
        ]);

        return response()->json(['message' => 'Checked out successfully', 'attendance' => $attendance]);
    }
}
