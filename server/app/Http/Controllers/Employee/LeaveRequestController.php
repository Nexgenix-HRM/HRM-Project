<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Notifications\LeaveStatusUpdated;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class LeaveRequestController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Employees see only their own requests
        return LeaveRequest::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
    }

    // Get only the authenticated user's own leave requests
    public function myLeaves()
    {
        return LeaveRequest::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'document' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('document')) {
            try {
                $file = $request->file('document');
                $path = cloudinary()->uploadApi()->upload($file->getRealPath(), [
                    'folder' => 'leaves',
                    'resource_type' => 'auto',
                    'use_filename' => true,
                    'unique_filename' => true
                ])['secure_url'];
            } catch (\Exception $e) {
                \Log::error("Cloudinary upload failed for leave request: " . $e->getMessage());
                return response()->json([
                    'message' => 'Failed to upload document to Cloudinary',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        $leave = LeaveRequest::create([
            'user_id' => Auth::id(),
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'document_path' => $path,
            'status' => 'pending',
        ]);

        // Notify managers via database (for dashboard visibility) and send email
        try {
            $leave->load('user');
            $managers = \App\Models\User::whereIn('role', ['hr', 'ceo'])->get();
            \Illuminate\Support\Facades\Notification::send($managers, new \App\Notifications\LeaveRequestSubmitted($leave, ['database']));

            // Send email ONLY to the designated address
            \Illuminate\Support\Facades\Notification::route('mail', 'mdmonir7458596@gmail.com')
                ->notify(new \App\Notifications\LeaveRequestSubmitted($leave, ['mail']));
        } catch (\Exception $e) {
            \Log::error("Failed to send leave submission notification: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Leave request submitted successfully',
            'leave' => $leave,
        ], 201);
    }
}
