<?php

namespace App\Models;
use App\Models\Task;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{

    protected $fillable =['name','email'];
    
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    
}
