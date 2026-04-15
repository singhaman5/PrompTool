import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { ListTodo, Timer, CheckCircle2, AlertCircle, Circle, ArrowRight } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import axios from '../api/axios';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const { tasks, fetchTasks, updateTask } = useTask();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchTasks();
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('/projects', {
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
        <StatCard icon={<ListTodo size={18} />} label="Total Tasks" value={tasks.length} color="blue" />
        <StatCard icon={<Timer size={18} />} label="In Progress" value={inProgressCount} color="indigo" />
        <StatCard icon={<CheckCircle2 size={18} />} label="Completed" value={completedCount} color="emerald" />
        <StatCard icon={<AlertCircle size={18} />} label="High Priority" value={highPriorityCount} color="rose" />
      </div>

      {/* 2. Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Recent Tasks & Chart */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Activity Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Weekly Activity</h2>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Last 7 Days</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 600}} dy={10} />
                  <Tooltip 
                    cursor={{fill: '#F8FAFC'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="completed" radius={[4, 4, 0, 0]} barSize={24}>
                     {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#3B82F6' : '#E2E8F0'} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Ongoing Tasks</h2>
              <Link to="/app/tasks" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {tasks.filter(t => t.status !== 'Done').slice(0, 4).map(task => (
                <div key={task._id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateTask(task._id, { status: 'Done' })}
                      className="text-gray-300 hover:text-blue-500 transition-colors"
                    >
                      <Circle size={18} />
                    </button>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{task.title}</h4>
                      {task.project && <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tight mt-0.5">{task.project.title}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                       task.priority === 'Urgent' ? 'bg-red-50 text-red-600' :
                       task.priority === 'High' ? 'bg-orange-50 text-orange-600' :
                       'bg-blue-50 text-blue-600'
                     }`}>
                       {task.priority}
                     </span>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status !== 'Done').length === 0 && (
                <div className="p-12 text-center text-gray-400 text-sm font-medium">✨ All tasks completed!</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Projects */}
        <div className="col-span-1 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold text-gray-900">Active Projects</h2>
            <Link to="/app/projects" className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">More</Link>
          </div>

          <div className="space-y-4">
            {projects.length > 0 ? projects.slice(0, 3).map((proj, idx) => (
              <div key={proj._id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{proj.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{proj.description}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    proj.color === 'green' ? 'bg-emerald-100 text-emerald-600' :
                    proj.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {proj.title.charAt(0)}
                  </div>
                </div>
                
                {/* Progress Mini Bar */}
                <div className="pt-2">
                   <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-tighter">
                     <span>Deployment</span>
                     <span className="text-gray-900">75%</span>
                   </div>
                   <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${
                        proj.color === 'green' ? 'bg-emerald-500' :
                        proj.color === 'orange' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`} style={{ width: `75%` }}></div>
                   </div>
                </div>
              </div>
            )) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-gray-400 text-sm font-medium">No projects yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
