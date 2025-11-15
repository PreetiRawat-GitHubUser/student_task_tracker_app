import React, { useState } from 'react';
import api from '../api/axios';

const Register = ({ onRegistered }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/register', { name, email, password, role });
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('auth_role', res.data.user.role); // save role
      onRegistered && onRegistered(res.data.user);
    } catch (e) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ marginBottom: 16 }}>
      <h3>Register</h3>
      <input 
        placeholder="Name" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        required 
      />
      <br/>
      <input 
        placeholder="Email" 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required 
      />
      <br/>
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required 
      />
      <br/>
      <label>Role: </label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <br/>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
