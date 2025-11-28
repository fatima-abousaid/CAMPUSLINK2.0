<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewReplyNotification extends Notification
{
    use Queueable;

    protected $reply;
    protected $user;

    public function __construct($reply, $user)
    {
        $this->reply = $reply;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'reply',
            'message' => $this->user->name . ' a répondu à votre commentaire',
            'announcement_id' => $this->reply->announcement_id,
            'comment_id' => $this->reply->id,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
        ];
    }
}
