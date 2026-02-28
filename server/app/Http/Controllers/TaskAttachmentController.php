<?php

namespace App\Http\Controllers;

use App\Models\TaskAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskAttachmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('task-attachments', 'public');

        $attachment = TaskAttachment::create([
            'task_id' => $request->task_id,
            'user_id' => $request->user()->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
        ]);

        return response()->json($attachment->load('user'), 201);
    }

    public function destroy($id)
    {
        $attachment = TaskAttachment::findOrFail($id);
        
        // Delete from storage
        Storage::disk('public')->delete($attachment->file_path);
        
        $attachment->delete();

        return response()->json(['message' => 'Attachment deleted successfully']);
    }
}
