import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Please fill in this field';
    else if (name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!email) newErrors.email = 'Please fill in this field';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Please fill in this field';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!profile) newErrors.profile = 'Please choose your profile picture';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    if (profile) formData.append('profile', profile);
    try {
      const res = await axios.post('https://bacendofleave.onrender.com/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setErrors({});
      setServerError('');
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: '' });
            }}
            className={`border p-3 w-full rounded ${errors.name ? 'border-red-500' : ''}`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: '' });
            }}
            className={`border p-3 w-full rounded ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
            }}
            className={`border p-3 w-full rounded ${errors.password ? 'border-red-500' : ''}`}
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-3 w-full rounded"
          >
            <option value="Employee">Employee</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Project Lead">Project Lead</option>
            <option value="HR">HR</option>
            <option value="CEO">CEO</option>
          </select>
        </div>
        <div className="mb-6">
          <input
            type="file"
            onChange={(e) => {
              setProfile(e.target.files[0]);
              setErrors({ ...errors, profile: '' });
            }}
            className={`w-full ${errors.profile ? 'border border-red-500 p-2 rounded' : ''}`}
            accept="image/*"
          />
          {errors.profile && <p className="text-red-500 text-sm mt-1">{errors.profile}</p>}
        </div>
        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
        <button type="submit" className="bg-sky-500 text-white p-3 w-full rounded font-medium">
          Register
        </button>
        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-sky-500">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;