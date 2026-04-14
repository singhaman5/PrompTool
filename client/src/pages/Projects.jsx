import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import axios from '../api/axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', color: 'blue', assignee: 'Assign yourself' });

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('  /api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('  /api/projects',
        {
          title: formData.title,
          description: formData.description,
          color: formData.color,
          assignee: formData.assignee
          // We can send assignee logic to backend later, for now we save the project
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProjects([res.data.data, ...projects]);
        setShowForm(false);
        setFormData({ title: '', description: '', color: 'blue', assignee: 'Assign yourself' });
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const mappedProjects = projects.map(p => {
    let colorClass = "bg-blue-100 text-blue-600";
    let barClass = "bg-blue-500";

    if (p.color === 'orange') {
      colorClass = "bg-orange-100 text-orange-600"; barClass = "bg-orange-500";
    } else if (p.color === 'green') {
      colorClass = "bg-emerald-100 text-emerald-600"; barClass = "bg-emerald-500";
    }

    return {
      id: p._id,
      title: p.title,
      tasksCount: p.taskCount || 0,
      description: p.description,
      progress: 0,
      color: colorClass,
      barColor: barClass,
      letter: p.title.charAt(0).toUpperCase(),
      team: p.assignee ? [p.assignee] : ["Assign yourself"] // Temporarily static, later we'll map actual members
    };
  });

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 pt-2">

      {/* 1. Page Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage and track your active projects.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter size={18} /> Filter
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <input type="text" placeholder="e.g. Website Redesign" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
              <select value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" placeholder="Brief project description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <select value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Assign yourself">Assign yourself</option>
                <option value="Another one">Another one (Email - Coming Soon)</option>
              </select>
            </div>

            <div className="col-span-2 flex gap-2 mt-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">Create Project</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 3. The Map Loop */}
        {mappedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {/* 'Add New' Placeholder Card */}
        <button onClick={() => setShowForm(true)} className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all h-full min-h-[220px] group">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <Plus size={24} />
          </div>
          <span className="font-medium">Create New Project</span>
        </button>

      </div>
    </div>
  );
};

export default Projects;