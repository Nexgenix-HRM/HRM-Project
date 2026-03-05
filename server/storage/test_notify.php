<?php

$user = \App\Models\User::first();
if (!$user) {
    echo "No users found. Cannot test.\n";
    exit;
}

$leave = \App\Models\LeaveRequest::create([
    'user_id' => $user->id,
    'start_date' => '2026-03-06',
    'end_date' => '2026-03-07',
    'reason' => 'Test reason',
    'status' => 'approved',
]);

try {
    $leave->load('user');
    $leave->user->notify(new \App\Notifications\LeaveStatusUpdated($leave));
    echo "Successfully sent notification.\n";
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
