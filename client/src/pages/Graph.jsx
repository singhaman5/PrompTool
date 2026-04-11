import React from 'react';
import { useTask } from '../context/TaskContext';

const Graph = () => {
  const { tasks } = useTask();

  // Calculate stats
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'Todo').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const done = tasks.filter(t => t.status === 'Done').length;

  const priorityCounts = {
    Urgent: tasks.filter(t => t.priority === 'Urgent').length,
    High: tasks.filter(t => t.priority === 'High').length,
    Medium: tasks.filter(t => t.priority === 'Medium').length,
    Low: tasks.filter(t => t.priority === 'Low').length,
  };

  const Bar = ({ label, value, max, color }) => (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600 w-24 text-right">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: max > 0 ? `${(value / max) * 100}%` : '0%' }}
        />
      </div>
      <span className="text-sm font-bold text-gray-700 w-8">{value}</span>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Graph</h1>
        <p className="text-gray-500 mt-1">Visual overview of your task progress.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: total, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
          { label: 'Todo', value: todo, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
          { label: 'In Progress', value: inProgress, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
          { label: 'Done', value: done, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-6 text-center`}>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Status Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Tasks by Status</h2>
        <div className="space-y-4">
          <Bar label="Todo" value={todo} max={total} color="bg-blue-500" />
          <Bar label="In Progress" value={inProgress} max={total} color="bg-orange-500" />
          <Bar label="Done" value={done} max={total} color="bg-emerald-500" />
        </div>
      </div>

      {/* Priority Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Tasks by Priority</h2>
        <div className="space-y-4">
          <Bar label="Urgent" value={priorityCounts.Urgent} max={total} color="bg-red-500" />
          <Bar label="High" value={priorityCounts.High} max={total} color="bg-orange-500" />
          <Bar label="Medium" value={priorityCounts.Medium} max={total} color="bg-blue-500" />
          <Bar label="Low" value={priorityCounts.Low} max={total} color="bg-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Graph;
