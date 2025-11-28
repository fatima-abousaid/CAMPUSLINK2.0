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
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'announcement_id' => $data['announcement_id'],
            'content' => $data['content'],
            'parent_id' => $data['parent_id'] ?? null,
        ]);

        // If this is a reply, notify the parent comment author
        if ($comment->parent_id) {
            $comment->load('parent.user');
            $parentComment = $comment->parent;
            if ($parentComment && $parentComment->user_id !== $request->user()->id) {
                $parentComment->user->notify(new \App\Notifications\NewReplyNotification($comment, $request->user()));
            }
        } else {
            // Notify the announcement owner for top-level comments
            $comment->load('announcement.user');
            $announcement = $comment->announcement;
            if ($announcement && $announcement->user_id !== $request->user()->id) {
                $announcement->user->notify(new \App\Notifications\NewCommentNotification($comment, $request->user()));
            }
        }

        return response()->json($comment->load('user'), 201);
    }
}