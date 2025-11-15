import React, { useState, useEffect } from "react";
import api from '../api/axios';

const TaskList = ({ refreshTrigger, onTaskDeleted, onTaskEdit, selectedStudentId }) => {
  const [tasks, setTasks] = useState([]);
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage] = useState(5); // items per page
  const [totalPages, setTotalPages] = useState(1);
  const role = localStorage.getItem('auth_role'); //admin or user for role-based access to delete/edit


  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, per_page: perPage };
      if (selectedStudentId) params.student_id = selectedStudentId;
      if (searchStudentName) params.student_name = searchStudentName;
      if (searchTitle) params.title = searchTitle;

      const response = await api.get('/tasks', { params });

      setTasks(response.data.data || []); // paginated tasks
      setTotalPages(response.data.last_page || 1); // total pages
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks(); // refresh after delete
      if (onTaskDeleted) onTaskDeleted();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ✅ Toggle status (Completed / Pending)
  const toggleStatus = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        status: task.status === "completed" ? "pending" : "completed",
      });
      fetchTasks(); // refresh
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger, selectedStudentId, page]);

  const handleSearch = (e) => {
    e?.preventDefault();
    setPage(1); // reset to first page
    fetchTasks();
  };

  const clearFilters = () => {
    setSearchStudentName("");
    setSearchTitle("");
    setPage(1);
    fetchTasks();
  };

  return (
    <div>
      <h2>
        Task List {selectedStudentId ? `(For Student ID: ${selectedStudentId})` : ""}
      </h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: 12 }}>
        <input
          placeholder="Search by student name"
          value={searchStudentName}
          onChange={(e) => setSearchStudentName(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Search by task title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={clearFilters} style={{ marginLeft: 8 }}>
          Clear
        </button>
      </form>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No Task Available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: 10 }}>
              <strong>{task.title}</strong>
              <div>Description: {task.description || "N/A"}</div>
              <div>Due Date: {task.due_date || "N/A"}</div>
              <div>
                Student: {task.student ? task.student.name : `ID ${task.student_id}`}
              </div>
              <div>Status: 
                <span style={{ fontWeight: "bold", color: task.status === "completed" ? "green" : "orange", marginLeft: 5 }}>
                  {task.status || "pending"}
                </span>
              </div>

              <div style={{ marginTop: 6 }}>
                {/* Toggle status button */}
                <button onClick={() => toggleStatus(task)} style={{ marginRight: 8 }}>
                  Mark as {task.status === "completed" ? "Pending" : "Completed"}
                </button>
                 {role === 'admin' && (
                  <>

                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ color: "red", marginRight: 8 }}
                >
                  Delete
                </button>
                <button
                  onClick={() => onTaskEdit(task)}
                >
                  Edit
                </button>
                </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: 20 }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            style={{ marginRight: 10 }}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            style={{ marginLeft: 10 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
