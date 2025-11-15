import React, { useState, useEffect } from "react";
import api from '../api/axios';

const StudentList = ({ refreshTrigger, onStudentDeleted, onStudentSelect, onStudentEdit }) => {
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            const response =await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error Fetching Students:', error);
        }
    };

    const deleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
           await api.delete(`/students/${id}`);
            setStudents(students.filter(student => student.id !== id));
            if (onStudentDeleted) onStudentDeleted();
        } catch (error) {
            console.error('Error deleting students:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [refreshTrigger]);

    return (
        <div>
            <h2>Student List</h2>
            {students.length === 0 ? (
                <p>No Students available.</p>
            ) : (
                <ul>
                    {students.map(student => (
                        <li key={student.id}>
                            <span
                                style={{ color: 'black', cursor: 'pointer' }}
                                onClick={() => onStudentSelect(student.id)}
                            >
                                {student.name}
                            </span> <br />
                            <button
                                onClick={() => deleteStudent(student.id)}
                                style={{ color: 'red', marginTop: '5px' }}
                            >
                                Delete
                            </button>
                            <button onClick={() => onStudentEdit(student)} style={{marginLeft:'5px'}}>
                                Edit
                            </button>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentList;
