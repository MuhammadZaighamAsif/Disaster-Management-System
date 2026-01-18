import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseTask = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  useEffect(() => {
    fetchAvailableTasks();
  }, []);

  const fetchAvailableTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/volunteers/tasks/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setTasks(result.data || []);
      } else {
        setError('Failed to load tasks');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTask = async (e) => {
    e.preventDefault();

    if (!selectedTaskId) {
      setError('Please select a task');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/volunteers/tasks/${selectedTaskId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        alert('Task assigned successfully!');
        navigate('/volunteer/dashboard');
      } else {
        setError(result.message || 'Failed to assign task');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error assigning task:', error);
    }
  };

  const onFieldTasks = tasks.filter(task => task.fieldType === 'ON_FIELD');
  const offFieldTasks = tasks.filter(task => task.fieldType === 'OFF_FIELD');

  const getPriorityColor = (priority) => {
    const colors = {
      URGENT: 'bg-red-100 text-red-800 border-red-300',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      LOW: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[priority] || colors.MEDIUM;
  };

  const renderTaskCard = (task) => {
    const spotsLeft = task.volunteersRequired - task.volunteersAssigned;
    const isAlmostFull = spotsLeft <= 2 && spotsLeft > 0;
    
    return (
      <label
        key={task._id}
        className={`p-6 border-2 rounded-lg cursor-pointer transition ${
          selectedTaskId === task._id
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-blue-400'
        }`}
      >
        <div className="flex items-start gap-4">
          <input
            type="radio"
            name="task"
            value={task._id}
            checked={selectedTaskId === task._id}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold">{task.title}</h3>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                {isAlmostFull && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold border border-orange-300">
                    Almost Full
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 mb-3">{task.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 font-medium">{task.taskType.replace(/_/g, ' ')}</span>
              </div>
              {task.location && (
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 font-medium">{task.location}</span>
                </div>
              )}
              {task.disaster?.name && (
                <div>
                  <span className="text-gray-500">Disaster:</span>
                  <span className="ml-2 font-medium">{task.disaster.name}</span>
                </div>
              )}
              {task.estimatedDuration && (
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium">{task.estimatedDuration}h</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold text-gray-700">
                  {task.volunteersAssigned} / {task.volunteersRequired} volunteers
                </span>
              </div>
              <span className={`text-sm font-medium ${spotsLeft > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : 'Full'}
              </span>
            </div>
          </div>
        </div>
      </label>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading available tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Choose a Task</h1>
        <p className="text-gray-600 mb-8">Select a task that matches your availability and skills</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 text-lg">No tasks available at the moment</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new volunteer opportunities</p>
          </div>
        ) : (
          <form onSubmit={handleSelectTask} className="space-y-8">
            {/* On-Field Tasks */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">On-Field Tasks</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {onFieldTasks.length} available
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">Tasks that require physical presence at the disaster site</p>
              
              {onFieldTasks.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                  No on-field tasks available
                </div>
              ) : (
                <div className="space-y-4">
                  {onFieldTasks.map(renderTaskCard)}
                </div>
              )}
            </div>

            {/* Off-Field Tasks */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">Off-Field Tasks</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {offFieldTasks.length} available
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">Tasks that can be done remotely or from coordination centers</p>
              
              {offFieldTasks.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                  No off-field tasks available
                </div>
              ) : (
                <div className="space-y-4">
                  {offFieldTasks.map(renderTaskCard)}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
              <button
                type="submit"
                disabled={!selectedTaskId}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                Confirm Task Selection
              </button>
              <button
                type="button"
                onClick={() => navigate('/volunteer/dashboard')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChooseTask;
