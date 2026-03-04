<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'ceo' || $user->role === 'hr') {
            $projects = Project::with(['owner:id,name', 'members:id,name,profile_image'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $projects = $user->projects()->with(['owner:id,name', 'members:id,name,profile_image'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'deadline' => 'nullable|date|after_or_equal:start_date',
            'members' => 'array',
            'members.*' => 'exists:users,id'
        ]);

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'deadline' => $request->deadline,
            'created_by' => Auth::id(),
            'status' => 'active'
        ]);

        if ($request->has('members')) {
            $project->members()->attach($request->members);

            // Notify members
            $members = User::whereIn('id', $request->members)->get();
            $notification = new \App\Notifications\ProjectAssignedNotification($project, Auth::user());
            foreach ($members as $member) {
                if ($member->id !== Auth::id()) {
                    $member->notify($notification);
                }
            }
        }
        
        // Add creator to members if not already there
        if (!$project->members()->where('user_id', Auth::id())->exists()) {
            $project->members()->attach(Auth::id());
        }

        // Create default lists
        $project->lists()->createMany([
            ['name' => 'Backlog', 'position' => 0],
            ['name' => 'To Do', 'position' => 1],
            ['name' => 'In Progress', 'position' => 2],
            ['name' => 'Review', 'position' => 3],
            ['name' => 'Done', 'position' => 4],
        ]);

        return response()->json($project->load('members'), 201);
    }

    public function show($id)
    {
        $user = Auth::user();
        
        $query = Project::query();

        if ($user->role === 'ceo' || $user->role === 'hr') {
            $query->with([
                'lists.tasks.assignees:id,name,profile_image',
                'lists.tasks.comments.user:id,name,profile_image',
                'lists.tasks.attachments.user:id,name,profile_image',
                'lists.tasks.subtasks',
                'lists.tasks.creator:id,name,profile_image',
            ]);
        } else {
            // Employees see only assigned tasks
            $query->with([
                'lists.tasks' => function ($query) use ($user) {
                    $query->whereHas('assignees', function ($q) use ($user) {
                        $q->where('users.id', $user->id);
                    })->with([
                        'assignees:id,name,profile_image',
                        'comments.user:id,name,profile_image',
                        'attachments.user:id,name,profile_image',
                        'subtasks',
                        'creator:id,name,profile_image',
                    ]);
                }
            ]);
        }

        $project = $query->with('members:id,name,profile_image,email,designation')->findOrFail($id);

        // Check permission
        if ($user->role !== 'ceo' && $user->role !== 'hr' && !$project->members->contains($user->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        // Only CEO, HR or Creator can update project details
        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && $project->created_by !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'deadline' => 'nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|required|in:active,completed,on_hold'
        ]);

        $project->update($request->only(['name', 'description', 'start_date', 'deadline', 'status']));

        return response()->json($project);
    }

    public function addMember(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && $project->created_by !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $project->members()->syncWithoutDetaching([$request->user_id]);

        // Notify member
        if ($request->user_id !== Auth::id()) {
            $user = User::findOrFail($request->user_id);
            $user->notify(new \App\Notifications\ProjectAssignedNotification($project, Auth::user()));
        }

        return response()->json($project->load('members'));
    }

    public function removeMember(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && $project->created_by !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        // Cannot remove creator
        if ($request->user_id == $project->created_by) {
             return response()->json(['message' => 'Cannot remove project creator'], 422);
        }

        $project->members()->detach($request->user_id);

        return response()->json($project->load('members'));
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && $project->created_by !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
