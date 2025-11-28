<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{



public function index(Request $request)
{
    $announcements = Announcement::with(['user'])
        ->withCount(['likes', 'comments']) 
        ->when($request->category, fn($q) => $q->where('category', $request->category))
        ->when($request->search, fn($q) => $q->where(function($sq) use ($request) {
            $sq->where('title', 'like', '%'.$request->search.'%')
               ->orWhere('description', 'like', '%'.$request->search.'%');
        }))
        ->latest()
        ->get();

    return response()->json($announcements);
}

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5048',
        ]);

        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('announcements', 'public');
        }

        $ann = Announcement::create($data);

        return response()->json($ann->load('user'), 201);
    }

public function show($id)
{
    return Announcement::with(['user', 'comments.user', 'comments.replies.user', 'likes.user'])
        ->withCount('likes')
        ->findOrFail($id);
}

    public function update(Request $request, $id)
    {
        $ann = $request->user()->announcements()->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5048',
        ]);

        if ($request->hasFile('image')) {
            if ($ann->image) Storage::disk('public')->delete($ann->image);
            $data['image'] = $request->file('image')->store('announcements', 'public');
        }

        $ann->update($data);

        return $ann->load('user');
    }

    public function destroy(Request $request, $id)
    {
        $ann = $request->user()->announcements()->findOrFail($id);
        if ($ann->image) Storage::disk('public')->delete($ann->image);
        $ann->delete();

        return response()->json(['message' => 'Supprimée']);
    }
}