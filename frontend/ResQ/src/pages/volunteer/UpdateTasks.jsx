import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const UpdateTasks = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [taskUpdates, setTaskUpdates] = useState({});

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const fetchAssignedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/volunteers/my-tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        setAssignedTasks(data);
        // Initialize task updates
        const updates = {};
        data.forEach((task) => {
          updates[task._id] = { status: task.status, notes: '' };
        });
        setTaskUpdates(updates);
      }
    } catch (error) {
      setError('Failed to load assigned tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/volunteers/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: taskUpdates[taskId].status,
          notes: taskUpdates[taskId].notes
        })
      });

      if (response.ok) {
        alert('Task updated successfully!');
        fetchAssignedTasks();
        setExpandedTaskId(null);
      } else {
        alert('Failed to update task');
      }
    } catch (error) {
      alert('Connection error');
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading assigned tasks...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800';
      case 'AVAILABLE':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Update Tasks</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {assignedTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No assigned tasks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-lg shadow-md">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex gap-4 text-sm flex-wrap">
                        <span className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(task.status)}`}>
                          {task.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-600">
                          <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                          {task.location || 'No location specified'}
                        </span>
                        <span className="text-gray-600">
                          🏷️ {task.taskType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-600">
                          📊 Priority: {task.priority}
                        </span>
                        {task.disaster?.name && (
                          <span className="text-gray-600">
                            🌪️ {task.disaster.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl">
                      {expandedTaskId === task._id ? '▼' : '▶'}
                    </div>
                  </div>
                </div>

                {expandedTaskId === task._id && (
                  <div className="border-t border-gray-200 p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status *
                      </label>
                      <select
                        value={taskUpdates[task._id]?.status || task.status}
                        onChange={(e) =>
                          setTaskUpdates({
                            ...taskUpdates,
                            [task._id]: {
                              ...taskUpdates[task._id],
                              status: e.target.value
                            }
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Progress Notes
                      </label>
                      <textarea
                        rows="3"
                        value={taskUpdates[task._id]?.notes || ''}
                        onChange={(e) =>
                          setTaskUpdates({
                            ...taskUpdates,
                            [task._id]: {
                              ...taskUpdates[task._id],
                              notes: e.target.value
                            }
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe progress, issues, or completion details..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleUpdateTask(task._id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        ✓ Save Update
                      </button>
                      <button
                        onClick={() => setExpandedTaskId(null)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTasks;
