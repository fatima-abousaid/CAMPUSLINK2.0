<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewCommentNotification extends Notification
{
    use Queueable;

    public $comment;
    public $user;

    public function __construct($comment, $user)
    {
        $this->comment = $comment;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'comment',
            'message' => $this->user->name . ' a commenté votre annonce : "' . $this->comment->announcement->title . '"',
            'announcement_id' => $this->comment->announcement_id,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
        ];
    }
}
