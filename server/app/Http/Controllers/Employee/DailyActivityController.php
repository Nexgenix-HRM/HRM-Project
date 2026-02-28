<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DailyActivity;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DailyActivityController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());

        return DailyActivity::where('user_id', Auth::id())
            ->where('date', $date)
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'description' => 'required|string',
        ]);

        $user = Auth::user();
        $today = Carbon::today()->toDateString();
        $start = $request->start_time;
        $end = $request->end_time;

        // Check for overlaps
        $overlap = DailyActivity::where('user_id', $user->id)
            ->where('date', $today)
            ->where(function ($query) use ($start, $end) {
                $query->where(function ($q) use ($start, $end) {
                    $q->where('start_time', '>=', $start)
                      ->where('start_time', '<', $end);
                })->orWhere(function ($q) use ($start, $end) {
                    $q->where('end_time', '>', $start)
                      ->where('end_time', '<=', $end);
                })->orWhere(function ($q) use ($start, $end) {
                    $q->where('start_time', '<=', $start)
                      ->where('end_time', '>=', $end);
                });
            })->exists();

        if ($overlap) {
            return response()->json(['message' => 'Time slot overlaps with an existing activity.'], 422);
        }

        $activity = DailyActivity::create([
            'user_id' => $user->id,
            'date' => $today,
            'start_time' => $start,
            'end_time' => $end,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Activity logged successfully',
            'activity' => $activity
        ], 201);
    }

    public function destroy(DailyActivity $dailyActivity)
    {
        if ($dailyActivity->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Prevent deleting past days
        if ($dailyActivity->date !== Carbon::today()->toDateString()) {
             return response()->json(['message' => 'Cannot delete activities from past dates.'], 403);
        }

        $dailyActivity->delete();
        return response()->json(['message' => 'Activity deleted successfully']);
    }
}
