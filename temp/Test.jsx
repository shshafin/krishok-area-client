import { useState } from 'react';
import { registerUser } from '../api/authApi';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      console.log('Registered:', res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterPage;