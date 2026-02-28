<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Todo;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    public function index()
    {
        return Todo::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_name' => 'required|string|max:255',
            'description' => 'required|string',
            'assigned_by' => 'required|string|max:255',
            'duration' => 'nullable|integer|min:0',
        ]);

        $user = Auth::user();
        $today = \Carbon\Carbon::today()->toDateString();

        // Check for existing submission
        $existing = Todo::where('user_id', $user->id)->where('date', $today)->first();
        if ($existing) {
            return response()->json(['message' => 'You have already submitted your work for today.'], 400);
        }

        $todo = Todo::create([
            'user_id' => $user->id,
            'date' => $today,
            'project_name' => $request->project_name,
            'description' => $request->description,
            'assigned_by' => $request->assigned_by,
            'duration' => $request->duration,
        ]);

        // Auto Check-out Logic
        $user = Auth::user();
        $today = \Carbon\Carbon::today()->toDateString();
        $attendance = \App\Models\Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($attendance) {
            $attendance->update([
                'check_out' => \Carbon\Carbon::now()->toTimeString()
            ]);
        } else {
            // If no check-in record exists, create one with safe defaults
            \App\Models\Attendance::create([
                'user_id' => $user->id,
                'date' => $today,
                'check_in' => \Carbon\Carbon::now()->subHours(9)->toTimeString(), // Assume 9 hours work if forgot to check in
                'check_out' => \Carbon\Carbon::now()->toTimeString(),
                'status' => 'present'
            ]);
        }

        return response()->json([
            'message' => 'Work submitted and Checked Out successfully',
            'todo' => $todo
        ], 201);
    }

    public function update(Request $request, Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $todo->update($request->only(['project_name', 'description', 'assigned_by', 'duration']));

        // Sync Check-out Time
        $user = Auth::user();
        $attendance = \App\Models\Attendance::where('user_id', $user->id)
            ->where('date', $todo->date)
            ->first();

        if ($attendance) {
            $attendance->update([
                'check_out' => \Carbon\Carbon::now()->toTimeString()
            ]);
        }

        return response()->json([
            'message' => 'Work submission updated successfully',
            'todo' => $todo
        ]);
    }

    public function destroy(Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $todo->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
