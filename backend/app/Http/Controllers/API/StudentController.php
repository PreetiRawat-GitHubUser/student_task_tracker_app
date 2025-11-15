<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user =$request->user();
        if($user->role ==='admin'){
            //admins get all students
            return response()->json(Student::all());
        }else {
            //normal user only gets their own student record
            $student = Student::where('email', $user->email)->first();
            return response()->json($student ? [$student]:[]);
        }
        // return response()->json(Student::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:students,email',
        ]);

        $student = Student::create($request->all());

       return response()->json($student, 201);
    //   return response()->json([
    //     'message' => 'Student created successfully'
    //   ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $student =Student::findOrFail($id);
        $student->update($request->all());
        return response()->json($student);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $student =Student::findOrFail($id);
        $student->delete();
        return response()->json(['message'=>'Deletedsuccessfully']);
    }
}
