<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'announcement_id' => 'required|exists:announcements,id',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'announcement_id' => $data['announcement_id'],
            'content' => $data['content'],
        ]);

        // Notify the announcement owner
        $comment->load('announcement.user');
        $announcement = $comment->announcement;
        if ($announcement && $announcement->user_id !== $request->user()->id) {
            $announcement->user->notify(new \App\Notifications\NewCommentNotification($comment, $request->user()));
        }

        return response()->json($comment->load('user'), 201);
    }
}