import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Plus, Calendar, Tag } from 'lucide-react';
import { useTask } from '../context/TaskContext';

const Board = () => {
  const { tasks, fetchTasks, updateTask, addTask } = useTask();
  const [addingToCol, setAddingToCol] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 2. THE COLUMNS CONFIGURATION
  const columns = [
    { id: 'Todo', title: 'To Do', color: 'bg-gray-50/50', border: 'border-gray-200/50', dot: 'bg-gray-400' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-50/30', border: 'border-blue-100', dot: 'bg-blue-500' },
    { id: 'Done', title: 'Done', color: 'bg-emerald-50/30', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { status });
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Board</h1>
           <p className="text-gray-500 mt-1">Visualize your workflow and drag tasks across stages.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-6 h-full min-w-[900px]">

          {columns.map((col) => {
            const colTasks = tasks.filter(t => t.status === col.id);

            return (
              <div
                key={col.id}
                className={`flex-1 flex flex-col min-w-[300px] h-full`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`}></div>
                    <h3 className="font-bold text-gray-800 text-sm">{col.title}</h3>
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setAddingToCol(col.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>

                {/* Task Cards List */}
                <div className={`flex-1 overflow-y-auto space-y-3 custom-scrollbar p-2 rounded-2xl border ${col.border} ${col.color}`}>
                  {addingToCol === col.id && (
                    <div className="bg-white p-3 rounded-xl shadow-sm border-2 border-blue-500 animate-in fade-in slide-in-from-top-2">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Task title..."
                        className="w-full text-sm outline-none text-gray-800 placeholder:text-gray-400 font-medium"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onBlur={() => {
                          if (!newTaskTitle.trim()) setAddingToCol(null);
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter' && newTaskTitle.trim()) {
                            await addTask({ title: newTaskTitle, status: col.id, priority: 'Medium' });
                            setNewTaskTitle("");
                            setAddingToCol(null);
                          } else if (e.key === 'Escape') {
                            setAddingToCol(null);
                            setNewTaskTitle("");
                          }
                        }}
                      />
                    </div>
                  )}

                  {colTasks.map((task) => (
                    <KanbanCard key={task._id} task={task} onDragStart={handleDragStart} />
                  ))}

                  {colTasks.length === 0 && !addingToCol && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200/50 rounded-xl">
                       <span className="text-xs text-gray-400 font-medium">No tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const KanbanCard = ({ task, onDragStart }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-50 text-red-600 border-red-100';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'medium': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className="bg-white p-4 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">{task.title}</h4>
        <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {task.project && (
           <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
             <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight truncate">
               {task.project.title}
             </span>
           </div>
        )}

        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
            {task.priority || 'Medium'}
          </span>
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;