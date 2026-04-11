import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
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
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNewProject = async () => {
    const title = prompt("Enter Project Title:");
    if (!title) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3001/api/projects',
        { title, description: "A new project", status: "Active", color: "blue" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProjects([res.data.data, ...projects]);
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  // 1. Transform raw Data to UI Props
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
      tasksCount: 0, // Would need task aggregation from backend based on project ID
      description: p.description,
      progress: 0,
      color: colorClass,
      barColor: barClass,
      letter: p.title.charAt(0).toUpperCase(),
      team: ["Me"]
    };
  });

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 pt-2">
      
      {/* 1. Page Actions */}
      <div className="flex justify-end gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Filter size={18} /> Filter
          </button>
          <button
            onClick={handleNewProject}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
            <Plus size={18} /> New Project
          </button>
      </div>

      {/* 2. Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 3. The Map Loop */}
        {mappedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {/* 'Add New' Placeholder Card */}
        <button onClick={handleNewProject} className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all min-h-[300px] group">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
            <Plus size={24} />
          </div>
          <span className="font-medium">Create New Project</span>
        </button>

      </div>
    </div>
  );
};

export default Projects;