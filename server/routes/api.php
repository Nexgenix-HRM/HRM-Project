<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Employee\DirectoryController;
use App\Http\Controllers\Employee\DashboardController;
use App\Http\Controllers\Employee\AttendanceController;
use App\Http\Controllers\Employee\TodoController;
use App\Http\Controllers\Employee\DailyActivityController;
use App\Http\Controllers\Employee\ProfileController;
use App\Http\Controllers\Employee\LeaveRequestController;
use App\Http\Controllers\Employee\NoticeController;
use App\Http\Controllers\CEO\MonitoringController;
use App\Http\Controllers\CEO\UserController;
use App\Http\Controllers\HR\NoticeController as HRNoticeController;
use App\Http\Controllers\HR\LeaveRequestController as HRLeaveRequestController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SubtaskController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\TaskAttachmentController;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/directory', [DirectoryController::class, 'index']);

    // Project Management Routes
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/add-member', [ProjectController::class, 'addMember']);
    Route::post('projects/{project}/remove-member', [ProjectController::class, 'removeMember']);
    
    Route::apiResource('task-lists', TaskListController::class)->only(['store', 'update', 'destroy']);
    
    Route::apiResource('tasks', TaskController::class)->only(['store', 'update', 'destroy']);
    Route::put('tasks/{task}/move', [TaskController::class, 'move']);
    
    Route::apiResource('task-comments', TaskCommentController::class)->only(['store', 'destroy']);

    // Subtasks
    Route::post('/subtasks', [SubtaskController::class, 'store']);
    Route::put('/subtasks/{subtask}', [SubtaskController::class, 'update']);
    Route::delete('/subtasks/{subtask}', [SubtaskController::class, 'destroy']);

    // Task Attachments
    Route::post('/task-attachments', [TaskAttachmentController::class, 'store']);
    Route::delete('/task-attachments/{id}', [TaskAttachmentController::class, 'destroy']);


    // Employee Dashboard
    Route::get('/employee/dashboard', [DashboardController::class, 'index']);

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::get('/attendance/status', [AttendanceController::class, 'status']);
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);

    // Todos
    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::put('/todos/{todo}', [TodoController::class, 'update']);
    Route::delete('/todos/{todo}', [TodoController::class, 'destroy']);

    // Daily Activities
    Route::get('/activities', [DailyActivityController::class, 'index']);
    Route::post('/activities', [DailyActivityController::class, 'store']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);



    // Leave Requests
    Route::get('/leaves', [HRLeaveRequestController::class, 'index']);
    Route::get('/leaves/my', [LeaveRequestController::class, 'myLeaves']);
    Route::post('/leaves', [LeaveRequestController::class, 'store']);
    Route::put('/leaves/{leaveRequest}/status', [HRLeaveRequestController::class, 'updateStatus']);

    // Notices
    Route::get('/notices', [NoticeController::class, 'index']);
    Route::middleware(['role:ceo,hr'])->group(function () {
        Route::get('/notices/all', [HRNoticeController::class, 'all']);
        Route::post('/notices', [HRNoticeController::class, 'store']);
        Route::put('/notices/{notice}', [HRNoticeController::class, 'update']);
        Route::put('/notices/{notice}/toggle-publish', [HRNoticeController::class, 'togglePublish']);
        Route::delete('/notices/{notice}', [HRNoticeController::class, 'destroy']);
    });

    // CEO and HR Monitoring Routes
    Route::middleware(['role:ceo,hr'])->group(function () {
        Route::prefix('monitoring')->group(function () {
            Route::get('/overview', [MonitoringController::class, 'overview']);
            Route::get('/activities', [MonitoringController::class, 'activities']);
            Route::get('/todos', [MonitoringController::class, 'todos']);
            Route::get('/attendance', [MonitoringController::class, 'attendance']);
        });
    });

    // CEO Specific Routes
    Route::middleware(['role:ceo'])->group(function () {
        Route::get('/ceo/users', [UserController::class, 'index']);
        Route::post('/ceo/users', [UserController::class, 'store']);
        Route::delete('/ceo/users/{id}', [UserController::class, 'destroy']);
    });

    // HR Specific User Management Routes
    Route::middleware(['role:hr'])->group(function () {
        Route::get('/hr/users', [UserController::class, 'index']);
        Route::post('/hr/users', [UserController::class, 'store']);
        Route::delete('/hr/users/{id}', [UserController::class, 'destroy']);
    });

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markOneAsRead']);
});
