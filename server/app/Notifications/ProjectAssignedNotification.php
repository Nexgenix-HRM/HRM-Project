<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectAssignedNotification extends Notification
{
    use Queueable;

    public $project;
    public $assignedBy;

    /**
     * Create a new notification instance.
     */
    public function __construct($project, $assignedBy)
    {
        $this->project = $project;
        $this->assignedBy = $assignedBy;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'project_assigned',
            'message' => "You have been added to project: {$this->project->name}",
            'project_id' => $this->project->id,
            'assigned_by' => $this->assignedBy->name,
        ];
    }
}
