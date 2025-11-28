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
            $user->likes()->create(['announcement_id' => $announcementId]);
            $liked = true;
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