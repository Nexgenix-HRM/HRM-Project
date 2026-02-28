<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'list_id',
        'title',
        'description',
        'priority',
        'deadline',
        'position',
        'created_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function list()
    {
        return $this->belongsTo(TaskList::class, 'list_id');
    }

    public function assignees()
    {
        return $this->belongsToMany(User::class, 'task_user');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function comments()
    {
        return $this->hasMany(TaskComment::class);
    }

    public function subtasks()
    {
        return $this->hasMany(Subtask::class);
    }

    public function attachments()
    {
        return $this->hasMany(TaskAttachment::class);
    }
}
