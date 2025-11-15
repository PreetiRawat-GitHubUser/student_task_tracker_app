import React, { useEffect, useState } from "react";
import api from '../api/axios';

const TaskForm = ({ onTaskCreated, selectedStudentId,editTask, onTaskUpdateComplete }) => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [wasUpdate, setWasUpdate] = useState(false);

  useEffect(() => {
   api.get('/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  //pre fill in edut mode

  useEffect(()=>{
    if (editTask){
      setStudentId(editTask.student_id);
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setDueDate(editTask.dueDate || '');

    } else {
      //reset when  not edditing
      setStudentId(selectedStudentId || '');
      setTitle('');
      setDescription('');
      setDueDate('');
    }
   },
    [editTask, selectedStudentId]
  );

  // useEffect(() => {
  //   if (selectedStudentId) {
  //     setStudentId(selectedStudentId);
  //   }
  // }, [selectedStudentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editTask){
        //update task
       await api.put(`/tasks/${editTask.id}`, {
          student_id: studentId,
          title,
          description,
          due_date: dueDate
        }
        );
        setWasUpdate(true);
        setSuccess(true);
        if(onTaskUpdateComplete) onTaskUpdateComplete();  
      } else{
        //create task
       await api.post('/tasks', {
        student_id: studentId,
        title,
        description,
        due_date: dueDate,
      });
      setWasUpdate(false);
      setSuccess(true);
      setTitle('');
      setDescription('');
      setDueDate('');
      setTimeout(() => setSuccess(false), 2000);
      if (onTaskCreated) onTaskCreated();
    } 
    setTimeout(()=> setSuccess(false),2000);
  }
    catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div>
      <h2>{editTask ? 'Edit Task' :'Assign Task to Student'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Student:</label><br />
          <select value={studentId} onChange={e => setStudentId(e.target.value)} required>
            <option value="">--Select--</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Title:</label><br />
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div>
          <label>Description</label><br />
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        <div>
          <label>Due Date:</label><br />
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>

        <button type="submit">{editTask ? 'Update Task': 'Create Task'}</button>
      </form>
      {success && <p style={{ color: 'green' }}>{wasUpdate ? 'Task Updated Successfully!' : 'Task created successfully!'}</p>}
    </div>
  );
};

export default TaskForm;
