<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoticeController extends Controller
{
    
    public function all()
    {
        return Notice::with(['creator:id,name,role', 'recipients:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
            'recipient_ids' => 'nullable|array',
            'recipient_ids.*' => 'exists:users,id',
        ]);

        $notice = Notice::create([
            'title' => $request->title,
            'content' => $request->content,
            'created_by' => Auth::id(),
            'is_published' => $request->is_published ?? false,
        ]);

        if ($request->has('recipient_ids')) {
            $notice->recipients()->sync($request->recipient_ids);
        }

        return response()->json([
            'message' => 'Notice created successfully',
            'notice' => $notice->load(['creator:id,name,role', 'recipients:id,name']),
        ], 201);
    }

   
    public function update(Request $request, Notice $notice)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
            'recipient_ids' => 'nullable|array',
            'recipient_ids.*' => 'exists:users,id',
        ]);

        $notice->update($request->only(['title', 'content', 'is_published']));

        if ($request->has('recipient_ids')) {
            $notice->recipients()->sync($request->recipient_ids);
        }

        return response()->json([
            'message' => 'Notice updated successfully',
            'notice' => $notice->load(['creator:id,name,role', 'recipients:id,name']),
        ]);
    }

    
    public function togglePublish(Notice $notice)
    {
        $notice->update(['is_published' => !$notice->is_published]);

        return response()->json([
            'message' => 'Notice status updated successfully',
            'notice' => $notice->load(['creator:id,name,role', 'targetUser:id,name']),
        ]);
    }

    
    public function destroy(Notice $notice)
    {
        $notice->delete();

        return response()->json(['message' => 'Notice deleted successfully']);
    }
}
