<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'announcement_id' => 'required|integer|exists:announcements,id'
        ]);

        $user = $request->user();
        $announcementId = $request->announcement_id;

        $like = $user->likes()->where('announcement_id', $announcementId)->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $newLike = $user->likes()->create(['announcement_id' => $announcementId]);
            $liked = true;

            // Notify the announcement owner
            $announcement = Announcement::with('user')->find($announcementId);
            if ($announcement && $announcement->user_id !== $user->id) {
                $newLike->load('announcement');
                $announcement->user->notify(new \App\Notifications\NewLikeNotification($newLike, $user));
            }
        }

        $announcement = Announcement::with(['user', 'likes.user'])
            ->withCount('likes')
            ->find($announcementId);

        return response()->json([
            'liked' => $liked,
            'likes_count' => $announcement->likes_count,
            'announcement' => $announcement
        ]);
    }
}