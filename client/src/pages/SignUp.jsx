import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useTask } from '../context/TaskContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { fetchTasks } = useTask();
  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('  /api/auth/signup',{name,email,password})
    .then(async (result) => {
      console.log(result);
      if(result.data.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        await fetchTasks();
        navigate('/app/dashboard');
      }
    })
    .catch(err => {
      console.log(err);
      alert(err.response?.data?.message || err.response?.data?.error || "Signup failed");
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900">PrompTool</h1>
          <p className="mt-2 text-sm text-slate-500">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="signup-name">
              Full name
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              placeholder="Enter Full Name"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="Create a password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-slate-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
