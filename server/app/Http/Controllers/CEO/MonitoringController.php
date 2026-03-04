<?php

namespace App\Http\Controllers\CEO;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\DailyActivity;
use App\Models\Todo;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MonitoringController extends Controller
{
    public function overview(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());
        $search = $request->query('search');
        $attendanceFilter = $request->query('attendance'); // all, present, absent
        
        // Base Query
        $query = User::whereIn('role', ['employee', 'hr']);

        // Search Filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('designation', 'like', "%{$search}%");
            });
        }

        // Attendance Filter
        if ($attendanceFilter === 'present') {
            $query->whereHas('attendance', fn($q) => $q->where('date', $date));
        } elseif ($attendanceFilter === 'absent') {
            $query->whereDoesntHave('attendance', fn($q) => $q->where('date', $date));
        }

        $employees = $query->get();
        
        // Summary stats - always based on total for the day, not the filtered list
        $allEmployees = User::whereIn('role', ['employee', 'hr'])->get();
        $employeeIds = $allEmployees->pluck('id')->toArray();
        $employeeCount = $allEmployees->count();

        $attendance = Attendance::where('date', $date)
            ->whereIn('user_id', $employeeIds)
            ->get()
            ->keyBy('user_id');
            
        $activities = DailyActivity::where('date', $date)
            ->whereIn('user_id', $employeeIds)
            ->get()
            ->groupBy('user_id');
            
        $todos = Todo::where('date', $date)
            ->whereIn('user_id', $employeeIds)
            ->get()
            ->keyBy('user_id');

        return response()->json([
            'date' => $date,
            'summary' => [
                'total_employees' => $employeeCount,
                'attendance' => [
                    'present' => $attendance->count(),
                    'absent' => $employeeCount - $attendance->count()
                ],
                'activities' => [
                    'submitted' => $activities->count(),
                    'pending' => $employeeCount - $activities->count()
                ],
                'todos' => [
                    'submitted' => $todos->count(),
                    'pending' => $employeeCount - $todos->count()
                ]
            ],
            'employees' => $employees->map(function ($user) use ($attendance, $activities, $todos) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'designation' => $user->designation,
                    'profile_image' => $user->profile_image,
                    'attendance' => $attendance->get($user->id),
                    'has_activity' => $activities->has($user->id),
                    'has_todo' => $todos->has($user->id),
                ];
            })
        ]);
    }

    public function activities(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());
        
        $activities = DailyActivity::with('user:id,name,role,designation,profile_image')
            ->where('date', $date)
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json($activities);
    }

    public function todos(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());

        $todos = Todo::with(['user' => function($q) use ($date) {
            $q->select('id', 'name', 'role', 'designation', 'profile_image')
              ->with(['attendance' => function($aq) use ($date) {
                  $aq->where('date', $date);
              }]);
        }])
            ->where('date', $date)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($todos);
    }

    public function attendance(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());

        $attendance = Attendance::with('user:id,name,role,designation,profile_image')
            ->where('date', $date)
            ->orderBy('check_in', 'asc')
            ->get();

        return response()->json($attendance);
    }
}
