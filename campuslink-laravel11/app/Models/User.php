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
<<<<<<< HEAD
        'role',
        'is_admin'
=======
        'role'
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
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
