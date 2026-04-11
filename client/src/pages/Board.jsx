import React, { useEffect } from 'react';
import { MoreHorizontal, Plus, Calendar } from 'lucide-react';
import { useTask } from '../context/TaskContext';

const Board = () => {
  const { tasks, fetchTasks, updateTask, addTask } = useTask();
  const [addingToCol, setAddingToCol] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 2. THE COLUMNS CONFIGURATION
  // Matches backend Database enum: 'Todo', 'In Progress', 'Done'
  const columns = [
    { id: 'Todo', title: 'To Do', color: 'bg-gray-100', dot: 'bg-gray-500', iconColor: 'text-gray-500' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-50', dot: 'bg-blue-500', iconColor: 'text-blue-500' },
    { id: 'Done', title: 'Done', color: 'bg-green-50', dot: 'bg-green-500', iconColor: 'text-green-500' },
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { status });
    }
  };

  return (
    <div className="board-theme h-full flex flex-col pt-2">

      {/* Kanban Board Grid */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-[750px] h-full">

          {columns.map((col) => {
            const colTasks = tasks.filter(t => t.status === col.id);

            return (
              <div
                key={col.id}
                className={`flex-1 rounded-2xl p-4 ${col.color} flex flex-col gap-4 h-full`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >

                {/* Column Header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`}></div>
                    <h3 className="font-bold text-gray-700">{col.title}</h3>
                    <span className="text-gray-400 text-sm font-medium">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setAddingToCol(col.id)}
                    className={`p-1 hover:bg-white rounded-md transition-colors ${col.iconColor}`}>
                    <Plus size={18} />
                  </button>
                </div>

                {/* Task Cards List */}
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pb-4">

                  {/* --- NEW INLINE INPUT BOX --- */}
                  {addingToCol === col.id && (
                    <div className="bg-white p-3 rounded-xl shadow-sm border-2 border-orange-400">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Type task... (Hit Enter)"
                        className="w-full text-sm outline-none text-gray-800 placeholder:text-gray-400"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onBlur={() => {
                          setAddingToCol(null);
                          setNewTaskTitle("");
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter' && newTaskTitle.trim()) {
                            await addTask({ title: newTaskTitle, status: col.id, priority: 'Medium' });
                            setAddingToCol(null);
                            setNewTaskTitle("");
                          } else if (e.key === 'Escape') {
                            setAddingToCol(null);
                            setNewTaskTitle("");
                          }
                        }}
                      />
                    </div>
                  )}
                  {/* ----------------------------- */}

                  {colTasks.map((task) => (
                    <KanbanCard key={task._id} task={task} onDragStart={handleDragStart} />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-center text-sm text-gray-400 py-4 border-2 border-dashed border-gray-200 rounded-lg">
                      Drop tasks here
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

// --- REUSABLE CARD COMPONENT ---
const KanbanCard = ({ task, onDragStart }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h4>
        <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-2">
        {task.project && (
          <span className="text-xs text-gray-500 block truncate">{task.project.title}</span>
        )}
        <span className={`w-max px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
          {task.priority || 'Medium'}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1 flex-wrap">
          {task.dueDate && (
            <span className="px-2 py-1 bg-gray-50 flex items-center gap-1 text-gray-500 text-[10px] rounded border border-gray-100">
              <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;