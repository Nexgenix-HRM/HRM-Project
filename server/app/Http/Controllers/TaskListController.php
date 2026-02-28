<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\TaskList;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class TaskListController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
        ]);

        $project = Project::findOrFail($request->project_id);
        
        // Check if user is member
        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members()->where('user_id', Auth::id())->exists()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $maxPosition = TaskList::where('project_id', $project->id)->max('position');

        $list = TaskList::create([
            'project_id' => $project->id,
            'name' => $request->name,
            'position' => $maxPosition + 1
        ]);

        return response()->json($list, 201);
    }

    public function update(Request $request, $id)
    {
        $list = TaskList::findOrFail($id);
        
        // Check access via project
        $project = $list->project;
        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members()->where('user_id', Auth::id())->exists()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'string|max:255',
            'position' => 'integer'
        ]);

        $list->update($request->only(['name', 'position']));

        return response()->json($list);
    }

    public function destroy($id)
    {
        $list = TaskList::findOrFail($id);
        $project = $list->project;

        if (Auth::user()->role !== 'ceo' && Auth::user()->role !== 'hr' && !$project->members()->where('user_id', Auth::id())->exists()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $list->delete();

        return response()->json(['message' => 'List deleted successfully']);
    }
}
