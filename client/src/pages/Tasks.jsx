import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, X, Plus, Calendar, Tag } from 'lucide-react';
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
        project: formData.project || null
      });
      setFormData({ title: '', project: '', priority: 'Medium', dueDate: '', description: '' });
      setShowForm(false);
    }
  };

  const toggleStatus = (task) => {
    updateTask(task._id, { status: task.status === 'Done' ? 'Todo' : 'Done' });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">Keep track of your personal and project tasks.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
               <input type="text" placeholder="e.g. Design new homepage" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div className="col-span-2 md:col-span-1">
               <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
               <select value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">No Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
               </select>
            </div>

            <div className="col-span-1 md:col-span-1">
               <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
               <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                 <option>Low</option>
                 <option>Medium</option>
                 <option>High</option>
                 <option>Urgent</option>
               </select>
            </div>

            <div className="col-span-2 md:col-span-1">
               <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
               <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="col-span-2 flex gap-2 mt-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">Add Task</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-7 pl-8">Task Details</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1 text-right"></div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-50">
          {tasks.map((task) => (
            <div key={task._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/80 transition-colors group">
              
              {/* Task Name & Project */}
              <div className="col-span-7 flex items-start gap-3">
                <button 
                  onClick={() => toggleStatus(task)} 
                  className="text-gray-300 hover:text-blue-500 mt-0.5 transition-colors"
                >
                   {task.status === 'Done' ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle size={20} />}
                </button>
                <div className="min-w-0">
                  <h4 className={`text-sm font-semibold text-gray-900 truncate ${task.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h4>
                  {task.project && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Tag size={10} className="text-blue-400" />
                      <span className="text-[10px] font-medium text-blue-500 uppercase tracking-tight">
                        {task.project.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityStyle(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                {task.dueDate && (
                  <>
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </>
                )}
              </div>

              {/* Delete Button */}
              <div className="col-span-1 flex justify-end">
                <button onClick={() => removeTask(task._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <X size={16} />
                </button>
              </div>

            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 size={32} className="text-gray-200" />
              </div>
              <h3 className="text-gray-900 font-semibold">No tasks found</h3>
              <p className="text-gray-500 text-sm mt-1">You're all caught up! Enjoy your day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;