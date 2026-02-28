<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class SubtaskController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'title' => 'required|string|max:255'
        ]);

        $task = Task::findOrFail($request->task_id);
        
        // Authorization check (Task member or Project member)
        $project = $task->project;
        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members->contains(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $subtask = Subtask::create([
            'task_id' => $request->task_id,
            'title' => $request->title,
            'is_completed' => false
        ]);

        return response()->json($subtask, 201);
    }

    public function update(Request $request, $id)
    {
        $subtask = Subtask::findOrFail($id);
        $task = $subtask->task;
        $project = $task->project;

        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members->contains(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'string|max:255',
            'is_completed' => 'boolean'
        ]);

        $subtask->update($request->only(['title', 'is_completed']));

        return response()->json($subtask);
    }

    public function destroy($id)
    {
        $subtask = Subtask::findOrFail($id);
        $task = $subtask->task;
        $project = $task->project;

        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members->contains(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $subtask->delete();

        return response()->json(['message' => 'Subtask deleted']);
    }
}
