import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, X, Plus } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import axios from 'axios';

const Tasks = () => {
  const { tasks, addTask, removeTask, updateTask, fetchTasks } = useTask();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', project: '', priority: 'Medium', dueDate: '', description: '' });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchTasks();
    const loadProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:3001/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    };
    loadProjects();
  }, [fetchTasks]);

  const getPriorityStyle = (p) => {
    switch(p) {
      case 'Urgent': return 'bg-red-50 text-red-600 border-red-100';
      case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Medium': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addTask({
        ...formData,
        project: formData.project || null // Send null if empty
      });
      setFormData({ title: '', project: '', priority: 'Medium', dueDate: '', description: '' });
      setShowForm(false);
    }
  };

  const toggleStatus = (task) => {
    updateTask(task._id, { status: task.status === 'Done' ? 'Todo' : 'Done' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 mt-1">Focus on your upcoming deliverables.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Add Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Task title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="col-span-2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
            <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="col-span-2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
            <select value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
              <option value="">No Project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
            <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
            <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors">Add Task</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">Task Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-50">
          {tasks.map((task) => (
            <div key={task._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors group">
              
              {/* Task Name & Project */}
              <div className="col-span-6 flex items-start gap-3">
                <button 
                  onClick={() => toggleStatus(task)} 
                  className="text-gray-300 hover:text-emerald-500 mt-0.5 transition-colors"
                >
                   {task.status === 'Done' ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle size={20} />}
                </button>
                <div>
                  <h4 className={`text-sm font-semibold text-gray-900 ${task.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {task.project?.title || ''}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {task.status}
                </span>
              </div>

              {/* Priority */}
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getPriorityStyle(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              {/* Delete Button */}
              <div className="col-span-2 flex justify-end">
                <button onClick={() => removeTask(task._id)} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100">
                  <X size={18} />
                </button>
              </div>

            </div>
          ))}
          {tasks.length === 0 && <div className="p-8 text-center text-gray-400">No tasks yet. Create one!</div>}
        </div>
      </div>
    </div>
  );
};

export default Tasks;