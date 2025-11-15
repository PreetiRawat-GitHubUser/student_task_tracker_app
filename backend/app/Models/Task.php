<?php

namespace App\Models;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    
    protected $fillable =['student_id','title','description','is_completed','status'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
