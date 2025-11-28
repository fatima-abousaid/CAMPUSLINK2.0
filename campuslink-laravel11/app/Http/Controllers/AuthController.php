<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; 

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if (Auth::attempt($credentials)) {
                $user = Auth::user();
                $token = $user->createToken('auth-token')->plainTextToken;

                return response()->json([
                    'message' => 'Login successful',
                    'user' => $user,
                    'token' => $token
                ]);
            }

            return response()->json(['error' => 'Invalid credentials'], 401);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json(['error' => 'Logout failed'], 500);
        }
    }


public function updateProfile(Request $request)
{
    $user = $request->user();

    $rules = [
        'name' => 'required|string|max:255',
        'date_of_birth' => 'nullable|date',
        'current_password' => 'required_with:new_password',
        'new_password' => 'nullable|min:6|confirmed',
    ];

    $data = $request->validate($rules);

    if ($request->filled('new_password')) {
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 422);
        }
        $data['password'] = Hash::make($request->new_password);
    }

    unset($data['current_password'], $data['new_password'], $data['new_password_confirmation']);

    $user->update($data);

    return response()->json(['message' => 'Profil mis à jour', 'user' => $user->fresh()]);
}
}