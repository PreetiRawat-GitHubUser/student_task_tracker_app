<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $user = $request->user();

    // Always start with eager-loaded student relationship
    $query = Task::with('student');

    // Role check
    if ($user->role !== 'admin') {
        // Normal users: only see their own tasks
        $student = \App\Models\Student::where('email', $user->email)->first();
        if (!$student) {
            return response()->json(['debug' => 'No matching student found for user email ' . $user->email], 200);// no tasks if no student profile
        }
        $query->where('student_id', $student->id);
    }

    //  Apply search filters
    if ($request->filled('student_id')) {
        $query->where('student_id', $request->student_id);
    }

    if ($request->filled('student_name')) {
        $name = $request->student_name;
        $query->whereHas('student', function ($q) use ($name) {
            $q->where('name', 'like', "%{$name}%");
        });
    }

    if ($request->filled('title')) {
        $query->where('title', 'like', '%' . $request->title . '%');
    }

    // Pagination (default 5 per page)
    $perPage = $request->get('per_page', 5);
    $tasks = $query->paginate($perPage);

    return response()->json($tasks);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'student_id'=>'required|exists:students,id',
            'title'=>'required|string',
            'description'=>'nullable|string',
           //due_date'=>'nullable|date',

        ]);
        $task =Task::create($request->all());
        return response()->json($task ,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task =Task::findOrFail($id);
        return response()->json($task);
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, string $id)
    // {
    //     $task = Task::findOrFail($id);
    //     $task->update($request->all());
    //     return response()->json($task);
    // }

    public function update(Request $request, $id)
{
    $task = Task::findOrFail($id);
    $user = $request->user();

    // If admin → can edit everything
    if ($user->role === 'admin') {
        $task->update($request->only(['title', 'description', 'due_date', 'status']));
        return response()->json($task);
    }

    // If user → can only mark their own task status
    $student = \App\Models\Student::where('email', $user->email)->first();
    if ($user->role === 'user' && $student && $task->student_id === $student->id) {
        $task->status = $request->status ?? $task->status;
        $task->save();
        return response()->json($task);
    }

    return response()->json(['message' => 'Forbidden'], 403);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task =Task::findOrFail($id);
        $task->delete();
        return response()->json(['message'=>'Deleted successfully']);
}
}
