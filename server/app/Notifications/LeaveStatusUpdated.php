<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\LeaveRequest;

use Illuminate\Queue\SerializesModels;

class LeaveStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $leaveRequest;

    public function __construct(LeaveRequest $leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $status = ucfirst($this->leaveRequest->status);
        $url = env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard/employee/leave';

        return (new MailMessage)
                    ->subject("Leave Request {$status}")
                    ->view('emails.leave_status', [
                        'leaveRequest' => $this->leaveRequest,
                        'notifiable' => $notifiable,
                        'actionUrl' => $url,
                    ]);
    }

    public function toArray(object $notifiable): array
    {
        $status = $this->leaveRequest->status;
        return [
            'leave_request_id' => $this->leaveRequest->id,
            'status' => $status,
            'type' => 'leave_status_updated',
            'message' => "Your leave request from {$this->leaveRequest->start_date} has been {$status}.",
        ];
    }
}
