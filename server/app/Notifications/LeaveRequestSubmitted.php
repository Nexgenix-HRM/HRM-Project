<?php

namespace App\Notifications;

use App\Models\LeaveRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeaveRequestSubmitted extends Notification
{
    use Queueable;

    protected $leaveRequest;
    protected $channels;

    public function __construct(LeaveRequest $leaveRequest, array $channels = ['database', 'mail'])
    {
        $this->leaveRequest = $leaveRequest;
        $this->channels = $channels;
    }

    public function via(object $notifiable): array
    {
        return $this->channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard/hr/leave'; // Or CEO
        if (isset($notifiable->role) && $notifiable->role === 'ceo') {
            $url = env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard/ceo/leave';
        }

        return (new MailMessage)
            ->subject('New Leave Request')
            ->line("{$this->leaveRequest->user->name} has submitted a new leave request.")
            ->action('Review Request', $url)
            ->line('Thank you for using our application!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'leave_request_id' => $this->leaveRequest->id,
            'user_name' => $this->leaveRequest->user->name,
            'start_date' => $this->leaveRequest->start_date,
            'end_date' => $this->leaveRequest->end_date,
            'reason' => $this->leaveRequest->reason,
            'type' => 'new_leave_request',
            'message' => "{$this->leaveRequest->user->name} requested leave from {$this->leaveRequest->start_date} to {$this->leaveRequest->end_date}.",
        ];
    }
}
