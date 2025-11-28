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

        return response()->json($comment->load('user'), 201);
    }
}