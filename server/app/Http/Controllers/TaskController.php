<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Task;
use App\Models\Project;
use App\Models\TaskList;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'list_id' => 'required|exists:task_lists,id',
            'title' => 'required|string|max:255',
            'priority' => 'in:low,medium,high',
            'deadline' => 'nullable|date',
            'assignees' => 'array',
            'assignees.*' => 'exists:users,id'
        ]);

        $project = Project::findOrFail($request->project_id);
        
        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members()->where('user_id', Auth::id())->exists()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate deadline against project deadline
        if ($request->deadline && $project->deadline && $request->deadline > $project->deadline) {
            return response()->json(['message' => 'Task deadline cannot exceed project deadline'], 422);
        }

        $maxPosition = Task::where('list_id', $request->list_id)->max('position');

        $task = Task::create([
            'project_id' => $project->id,
            'list_id' => $request->list_id,
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority ?? 'medium',
            'deadline' => $request->deadline,
            'position' => $maxPosition + 1,
            'created_by' => Auth::id()
        ]);

        if ($request->has('assignees')) {
            $task->assignees()->attach($request->assignees);
            
            // Notify assignees
            $assignees = User::whereIn('id', $request->assignees)->get();
            $notification = new \App\Notifications\TaskAssignedNotification($task, Auth::user());
            foreach ($assignees as $assignee) {
                if ($assignee->id !== Auth::id()) {
                    $assignee->notify($notification);
                }
            }
        }

        return response()->json($task->load(['assignees', 'creator']), 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $project = $task->project;

        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members()->where('user_id', Auth::id())->exists()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'string|max:255',
            'priority' => 'in:low,medium,high',
            'deadline' => 'nullable|date',
            'list_id' => 'exists:task_lists,id',
            'assignees' => 'array'
        ]);

         if ($request->deadline && $project->deadline && $request->deadline > $project->deadline) {
            return response()->json(['message' => 'Task deadline cannot exceed project deadline'], 422);
        }

        $task->update($request->only(['title', 'description', 'priority', 'deadline', 'list_id', 'position']));

        if ($request->has('assignees')) {
            $task->assignees()->sync($request->assignees);
            // TODO: Send notification to new assignees
        }

        return response()->json($task->load(['assignees', 'comments.user', 'attachments.user', 'subtasks', 'creator']));
    }

    public function move(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $project = $task->project;

        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members()->where('user_id', Auth::id())->exists()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'list_id' => 'required|exists:task_lists,id',
            'position' => 'required|integer'
        ]);

        $task->update([
            'list_id' => $request->list_id,
            'position' => $request->position
        ]);

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $project = $task->project;

        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members()->where('user_id', Auth::id())->exists()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
