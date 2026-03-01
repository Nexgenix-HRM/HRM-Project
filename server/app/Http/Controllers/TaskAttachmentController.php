<?php

namespace App\Http\Controllers;

use App\Models\TaskAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class TaskAttachmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $uploadedFileUrl = cloudinary()->uploadApi()->upload($file->getRealPath(), [
            'folder' => 'task-attachments'
        ])['secure_url'];

        $attachment = TaskAttachment::create([
            'task_id' => $request->task_id,
            'user_id' => $request->user()->id,
            'file_path' => $uploadedFileUrl,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
        ]);

        return response()->json($attachment->load('user'), 201);
    }

    public function destroy($id)
    {
        $attachment = TaskAttachment::findOrFail($id);
        
        // Delete from Cloudinary if it's a Cloudinary URL
        if (str_starts_with($attachment->file_path, 'http')) {
            // Note: Cloudinary deletion usually requires public_id which we might not have stored.
            // For now, we delete from database. If needed, we can extract public_id from URL.
        } else {
            Storage::disk('public')->delete($attachment->file_path);
        }
        
        $attachment->delete();

        return response()->json(['message' => 'Attachment deleted successfully']);
    }
}
