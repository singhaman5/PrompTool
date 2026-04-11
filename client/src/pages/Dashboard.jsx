import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { ListTodo, Timer, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { tasks, fetchTasks, updateTask } = useTask();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchTasks();
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('http://localhost:3001/api/projects', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            setProjects(res.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard projects:', err);
      }
    };
    fetchProjects();
  }, [fetchTasks]);

  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Done').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length;

  // Mock data for CV-Ready chart
  const activityData = [
    { name: 'Mon', completed: 4 },
    { name: 'Tue', completed: 7 },
    { name: 'Wed', completed: 5 },
    { name: 'Thu', completed: 8 },
    { name: 'Fri', completed: 3 },
    { name: 'Sat', completed: 9 },
    { name: 'Sun', completed: 6 },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* 1. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<ListTodo size={20} />} label="Total Tasks" value={tasks.length} color="blue" />
        <StatCard icon={<Timer size={20} />} label="In Progress" value={inProgressCount} color="orange" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completed" value={completedCount} color="green" />
        <StatCard icon={<AlertCircle size={20} />} label="High Priority" value={highPriorityCount} color="red" />
      </div>

      {/* 2. Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Recent Tasks & Chart (Takes 2 columns) */}
        <div className="col-span-2 space-y-6">
          
          {/* C. Weekly Activity Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Weekly Activity</h2>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="completed" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* B. Recent Tasks with "Mark as Done" */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Tasks</h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status !== 'Done').slice(0, 5).map(task => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggleDone={() => updateTask(task._id, { status: 'Done' })}
                />
              ))}
              {tasks.filter(t => t.status !== 'Done').length === 0 && <p className="text-gray-500 text-sm">No active tasks right now!</p>}
            </div>
          </div>

        </div>

        {/* Right: Projects (Takes 1 column) */}
        <div className="col-span-1 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">Projects</h2>

          {projects.length > 0 ? projects.slice(0, 4).map((proj, idx) => {
            const bgColors = ["bg-orange-50", "bg-blue-50", "bg-green-50", "bg-purple-50"];
            const pColors = ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500"];
            const bColor = bgColors[idx % bgColors.length];
            const pColor = pColors[idx % pColors.length];

            // A. Progress Bar Math (Mock calculation based on string hash for visual variety)
            const randomProgress = [35, 68, 85, 20][idx % 4];

            return (
              <div key={proj._id} className={`${bColor} border border-transparent hover:border-gray-200 transition-colors p-5 rounded-2xl shadow-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${pColor}`}></div>
                  <h3 className="font-bold text-gray-800">{proj.title}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-1">{proj.description}</p>
                
                {/* A. Progress Bar UI */}
                <div>
                   <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                     <span>Progress</span>
                     <span>{randomProgress}%</span>
                   </div>
                   <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${pColor} rounded-full`} style={{ width: `${randomProgress}%` }}></div>
                   </div>
                </div>
              </div>
            );
          }) : (
            <p className="text-gray-500 text-sm">No projects active.</p>
          )}

        </div>
      </div>
    </div>
  );
};

// Helper for Task Row
const TaskItem = ({ task, onToggleDone }) => {
  const getPriorityColors = (p) => {
    switch (p?.toLowerCase()) {
      case 'urgent':
      case 'high': return "bg-red-100 text-red-600";
      case 'medium': return "bg-orange-100 text-orange-600";
      case 'low': return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 hover:shadow-md hover:border-orange-200 rounded-xl transition-all group">
      <div className="flex items-center gap-4">
        {/* Quick Done Checkbox */}
        <button 
          onClick={onToggleDone}
          className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-orange-500 transition-colors"
          title="Mark as Done"
        >
           <span className="w-2.5 h-2.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </button>
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
          <p className="text-xs text-gray-500">{task.project ? task.project.title : 'No Project'}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wider ${getPriorityColors(task.priority)}`}>
          {task.priority || 'None'}
        </span>
        <span className="text-xs text-gray-400 font-medium">
            {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default Dashboard;
