<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\LeaveStatusUpdated;

class LeaveRequestController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'ceo') {
            // CEO sees all requests
            return LeaveRequest::with('user')->orderBy('created_at', 'desc')->get();
        }
        
        if ($user->role === 'hr') {
            // HR sees only employee requests
            return LeaveRequest::with('user')
                ->whereHas('user', function($query) {
                    $query->where('role', 'employee');
                })
                ->orderBy('created_at', 'desc')
                ->get();
        }
        
        // Employees see only their own requests
        return LeaveRequest::with('user')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function updateStatus(Request $request, LeaveRequest $leaveRequest)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $leaveRequest->update([
            'status' => $request->status,
        ]);

        // Send email and database notification
        try {
            $leaveRequest->load('user');
            if ($leaveRequest->user) {
                $leaveRequest->user->notify(new \App\Notifications\LeaveStatusUpdated($leaveRequest));
            }
        } catch (\Exception $e) {
            \Log::error("Failed to send leave status notification: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Leave request status updated successfully',
            'leave' => $leaveRequest,
        ]);
    }
}
