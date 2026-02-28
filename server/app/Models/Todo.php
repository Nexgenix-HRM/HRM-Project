<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'project_name',
        'description',
        'assigned_by',
        'duration',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
