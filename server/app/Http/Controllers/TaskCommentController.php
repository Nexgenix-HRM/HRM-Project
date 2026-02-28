<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Support\Facades\Auth;

class TaskCommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'comment' => 'required|string'
        ]);

        $task = Task::findOrFail($request->task_id);
        $project = $task->project;

        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members()->where('user_id', Auth::id())->exists()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment = TaskComment::create([
            'task_id' => $task->id,
            'user_id' => Auth::id(),
            'comment' => $request->comment
        ]);

        // Notify task assignees and owner
        $recipients = $task->assignees->merge([$task->creator])->unique('id');
        $notification = new \App\Notifications\TaskCommentNotification($comment);
        
        foreach ($recipients as $recipient) {
            if ($recipient && $recipient->id !== Auth::id()) {
                $recipient->notify($notification);
            }
        }

        return response()->json($comment->load('user'), 201);
    }

    public function destroy($id)
    {
        $comment = TaskComment::findOrFail($id);
        
        if (Auth::id() !== $comment->user_id && Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
