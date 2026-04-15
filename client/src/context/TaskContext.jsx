import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../api/axios';

const TaskContext = createContext();

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get('/tasks', { headers: getAuthHeader() });
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    try {
      const res = await axios.post('/tasks', taskData, { headers: getAuthHeader() });
      if (res.data.success) {
        setTasks(prev => [res.data.data, ...prev]);
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const removeTask = async (id) => {
    try {
      const res = await axios.delete(`/tasks/${id}`, { headers: getAuthHeader() });
      if (res.data.success) {
        setTasks(prev => prev.filter(task => task._id !== id));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const updateTask = async (id, updatedFields) => {
    try {
      const res = await axios.put(`/tasks/${id}`, updatedFields, { headers: getAuthHeader() });
      if (res.data.success) {
        setTasks(prev => prev.map(task => task._id === id ? res.data.data : task));
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, updateTask, loading, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within TaskProvider');
  return context;
};
