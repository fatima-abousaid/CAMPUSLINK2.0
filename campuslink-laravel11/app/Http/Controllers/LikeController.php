<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
<<<<<<< HEAD
        $request->validate([
            'announcement_id' => 'required|integer|exists:announcements,id'
        ]);
=======
$request->validate([
    'announcement_id' => 'required|integer|exists:announcements,id'
]);
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a

        $user = $request->user();
        $announcementId = $request->announcement_id;

        $like = $user->likes()->where('announcement_id', $announcementId)->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
<<<<<<< HEAD
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
=======
            $user->likes()->create(['announcement_id' => $announcementId]);
            $liked = true;
        }

  $announcement = Announcement::with(['user', 'likes.user'])
    ->withCount('likes')
    ->find($announcementId);
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a

        return response()->json([
            'liked' => $liked,
            'likes_count' => $announcement->likes_count,
            'announcement' => $announcement
        ]);
    }
}