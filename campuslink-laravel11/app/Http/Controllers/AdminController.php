<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Announcement;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_announcements' => Announcement::count(),
            'total_comments' => Comment::count(),
            'total_likes' => Like::count(),
        ];

        return response()->json($stats);
    }

    public function users()
    {
        $users = User::withCount(['announcements', 'comments', 'likes'])
            ->latest()
            ->get();

        return response()->json($users);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Vous ne pouvez pas vous supprimer'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    public function announcements()
    {
        $announcements = Announcement::with('user')
            ->withCount(['comments', 'likes'])
            ->latest()
            ->get();

        return response()->json($announcements);
    }

    public function deleteAnnouncement($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json(['message' => 'Annonce supprimée']);
    }
}
