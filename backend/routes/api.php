<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\StudentController;
use  Illuminate\Support\Facades\Hash;
use App\Models\User;

//register route
Route::post('/register', function (Request $request) {
    $data = $request->validate([
        'name'     => 'required|string',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|min:6',
        'role'     => 'in:admin,user' 
    ]);

    $user = User::create([
        'name'     => $data['name'],
        'email'    => $data['email'],
        'password' => bcrypt($data['password']),
        'role'     => $data['role'] ?? 'user',
    ]);

    $token = $user->createToken('spa')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ]
    ], 201);
});

 
//login route
Route::post('/login', function (Request $request) {
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('spa')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role, // include role in login response
        ]
    ]);
});


//logout route
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
$request->user()->currentAccessToken()->delete();
return response()->json(['message'=>'Logged out']);
});


// Admin-only routes
Route::middleware(['auth:sanctum', 'admin'])->group(function() {
    Route::apiResource('students', \App\Http\Controllers\API\StudentController::class);
    // Maybe admin-only endpoints like deleteTask, updateStudent, etc.
});

// Authenticated (both admin & user) routes
Route::middleware('auth:sanctum')->group(function() {
    Route::apiResource('tasks', \App\Http\Controllers\API\TaskController::class);
});

// //protecting routes check for role admin or normal user if admin get all data if its user, get related data to that user only.
// Route::middleware(['auth:sanctum', 'admin'])->group(function(){
// Route::apiResource('students',\App\Http\Controllers\API\StudentController::class);
// Route::apiResource('tasks', \App\Http\Controllers\API\TaskController::class);
// });
