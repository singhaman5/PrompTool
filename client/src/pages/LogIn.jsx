import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useTask } from '../context/TaskContext';

const LogIn = () => {
  const navigate = useNavigate();
  const { fetchTasks } = useTask();
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // STEP 2a: Login request backend ko bheji jaati hai
    axios.post('http://localhost:3001/api/auth/login',{email,password})
    .then(async (result) => {
      console.log("Server Says:",result.data);
      if(result.data.success) {
        // ⭐ STEP 2b: Backend se jo JWT token aaya, usse localStorage mein save karo
        // Yeh token browser mein store hota hai (MongoDB mein NAHI jaata)
        // Har baar jab user page reload karega, token yahan se milega
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        
        // Token store hone ke baad tasks fetch karo (token header mein jayega)
        await fetchTasks();
        navigate('/app/dashboard');
      }else{
        alert(result.data.message || "Login failed");
      }
    })
    .catch(err => {
      console.log(err);
      alert(err.response?.data?.message || "Login failed")
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900">PrompTool</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
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
            onClick={handleSubmit}
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-slate-900 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
