<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewLikeNotification extends Notification
{
    use Queueable;

    public $like;
    public $user;

    public function __construct($like, $user)
    {
        $this->like = $like;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'like',
            'message' => $this->user->name . ' a aimé votre annonce : "' . $this->like->announcement->title . '"',
            'announcement_id' => $this->like->announcement_id,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
        ];
    }
}
