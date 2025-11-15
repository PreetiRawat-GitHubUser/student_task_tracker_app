import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const StudentForm = ({ onStudentCreated, editStudent, onUpdateComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

      // Pre-fill form in edit mode
    useEffect(() => {
        if (editStudent) {
            setName(editStudent.name);
            setEmail(editStudent.email);
        }
    }, [editStudent]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

     try {
       let response;
            if (editStudent) {
                // Update existing student
                response = await api.put(`/students/${editStudent.id}`, { name, email });
                setSuccessMessage('Student updated successfully');
                if (onUpdateComplete) onUpdateComplete();
            } else {
                // Create new student
                 response = await api.post('/students', { name, email });
                onStudentCreated(response.data);
                setSuccessMessage('Student created successfully');
            }

            setName('');
            setEmail('');

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };


  return (
    <form onSubmit={handleSubmit}>
      <h2>{editStudent ? 'Edit Student' : 'Create Student'}</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <br />
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <br />
       <button type="submit">{editStudent ? 'Update' : 'Add'} Student</button>
    </form>
  );
};

export default StudentForm;
