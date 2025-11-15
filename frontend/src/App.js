import React, { useState } from 'react';
import './App.css';

import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';

import api from './api/axios';

const App = () => {
  const [refresh, setRefresh] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('auth_token'));

  // load role from localStorage (saved during login/register)
  const role = localStorage.getItem('auth_role'); 

  // refresh triggers
  const handleDataChange = () => setRefresh(prev => !prev);
  const handleUpdateComplete = () => { setEditStudent(null); handleDataChange(); };
  const handleTaskUpdateComplete = () => { setEditTask(null); handleDataChange(); };

  // logout
  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role'); // clear role too
      setIsAuthed(false);
    }
  };

  // If not logged in → show only login/register
  if (!isAuthed) {
    return (
      <div className="container">
        <h1 className="header">Student Task Tracker</h1>
        <Register onRegistered={() => setIsAuthed(true)} />
        <p style={{ marginTop: 10 }}>Already have an account? Login.</p>
        <Login onLoggedIn={() => setIsAuthed(true)} />
      </div>
    );
  }

  // If logged in → dashboard
  return (
    <div className="container">
      <h1 className="header">Student Task Tracker ({role})</h1>

      <div className="grid">
        {/* Show student management ONLY if admin */}
        {role === 'admin' && (
          <div className="card sticky">
            <div className="section">
              <StudentForm
                onStudentCreated={handleDataChange}
                editStudent={editStudent}
                onUpdateComplete={handleUpdateComplete}
              />
            </div>
            <hr />
            <div className="section">
              <StudentList
                refreshTrigger={refresh}
                onStudentDeleted={handleDataChange}
                onStudentSelect={setSelectedStudentId}
                onStudentEdit={setEditStudent}
              />
            </div>
          </div>
        )}

        {/* Tasks Section */}
        <div className="card">
          <div className="section">
            {/* Admin can assign/create tasks */}
            {role === 'admin' && (
              <TaskForm
                onTaskCreated={handleDataChange}
                selectedStudentId={selectedStudentId}
                editTask={editTask}
                onTaskUpdateComplete={handleTaskUpdateComplete}
              />
            )}
          </div>

          {role === 'admin' && <hr />}

          <div className="section">
            {/* Both admin & user see task list */}
            <TaskList
              refreshTrigger={refresh}
              onTaskDeleted={handleDataChange}
              selectedStudentId={selectedStudentId}
              onTaskEdit={setEditTask}
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogout} 
        style={{ float: 'right', marginBottom: '10px', marginTop:"10px" }}
      >
        Logout
      </button>
    </div>
  );
};

export default App;
