<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProfileController extends Controller
{
    public function show()
    {
        return response()->json(Auth::user());
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'mobile_number' => 'nullable|string|max:20',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['name', 'designation', 'mobile_number']);

        if ($request->hasFile('profile_image')) {
            // No need to delete old local image if we're moving to Cloudinary,
            // but for consistency we can keep the logic if it was a local path before
            if ($user->profile_image && !str_starts_with($user->profile_image, 'http')) {
                Storage::disk('public')->delete($user->profile_image);
            }
            
            try {
                $uploadedFileUrl = Cloudinary::upload($request->file('profile_image')->getRealPath(), [
                    'folder' => 'profiles'
                ])->getSecurePath();
                $data['profile_image'] = $uploadedFileUrl;
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Cloudinary upload failed: ' . $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ], 500);
            }
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
