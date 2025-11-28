<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
   use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_admin'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function likes()
{
    return $this->hasMany(Like::class);
}

public function hasLiked($announcement)
{
    return $this->likes()->where('announcement_id', $announcement->id ?? $announcement)->exists();
}
}
