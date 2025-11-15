import React, { useState } from 'react';
import api from '../api/axios';

const Login = ({ onLoggedIn }) => { //Login is a functional component. It takes one prop: onLoggedIn. This is likely a callback function passed from the parent (for example, to update app state when login succeeds).
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');//Both are initially empty ('').setEmail / setPassword → functions used to update those values.

  const submit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('auth_token', res.data.token);
    localStorage.setItem('auth_role', res.data.user.role); //  save role
    onLoggedIn && onLoggedIn(res.data.user);
  } catch (e) {
    alert('Login failed');
  }
};

  return (
    <form onSubmit={submit} className="card" style={{ marginBottom: 16 }}>
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <br/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <br/>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
