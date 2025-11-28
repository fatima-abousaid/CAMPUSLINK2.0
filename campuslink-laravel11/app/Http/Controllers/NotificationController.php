<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->notifications()->latest()->get());
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'Notification lue']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Toutes les notifications lues']);
    }

    public function unreadCount(Request $request)
    {
        return response()->json(['count' => $request->user()->unreadNotifications()->count()]);
    }
}
