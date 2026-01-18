const Task = require('../models/Task.model');
const User = require('../models/User.model');

// @desc    Get available tasks (for volunteers to choose)
// @route   GET /api/volunteers/tasks/available
// @access  Private/Volunteer
exports.getAvailableTasks = async (req, res) => {
  try {
    const { taskType, priority, disaster, fieldType } = req.query;
    
    // Get tasks that are AVAILABLE or ASSIGNED but not full
    const filter = {
      $or: [
        { status: 'AVAILABLE' },
        { 
          status: 'ASSIGNED',
          $expr: { $lt: ['$volunteersAssigned', '$volunteersRequired'] }
        }
      ]
    };
    
    if (taskType) filter.taskType = taskType.toUpperCase();
    if (priority) filter.priority = priority.toUpperCase();
    if (disaster) filter.disaster = disaster;
    if (fieldType) filter.fieldType = fieldType.toUpperCase();

    const tasks = await Task.find(filter)
      .populate('disaster', 'name type location city')
      .populate('assignedVolunteers', 'name email')
      .sort({ priority: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available tasks',
    });
  }
};

// @desc    Get volunteer's assigned tasks
// @route   GET /api/volunteers/my-tasks
// @access  Private/Volunteer
exports.getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { assignedVolunteers: req.user.id };
    if (status) filter.status = status.toUpperCase();

    const tasks = await Task.find(filter)
      .populate('disaster', 'name type location city')
      .populate('assignedVolunteers', 'name email')
      .sort({ priority: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your tasks',
    });
  }
};

// @desc    Choose/assign task to self
// @route   POST /api/volunteers/tasks/:id/assign
// @access  Private/Volunteer
exports.assignTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.status !== 'AVAILABLE' && task.status !== 'ASSIGNED') {
      return res.status(400).json({
        success: false,
        message: 'Task is not available',
      });
    }

    // Check if volunteer is already assigned
    if (task.assignedVolunteers && task.assignedVolunteers.some(v => v.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already assigned to this task',
      });
    }

    // Check if volunteer limit reached
    if (task.volunteersAssigned >= task.volunteersRequired) {
      return res.status(400).json({
        success: false,
        message: 'This task has reached its volunteer limit',
      });
    }

    // Add volunteer to task
    if (!task.assignedVolunteers) {
      task.assignedVolunteers = [];
    }
    task.assignedVolunteers.push(req.user.id);
    task.volunteersAssigned = task.assignedVolunteers.length;
    
    // Update status based on volunteer count
    if (task.volunteersAssigned >= task.volunteersRequired) {
      task.status = 'ASSIGNED';
    } else {
      task.status = 'ASSIGNED'; // Partially assigned but still accepting
    }
    
    if (!task.assignedAt) {
      task.assignedAt = Date.now();
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task assigned successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning task',
    });
  }
};

// @desc    Update task status
// @route   PUT /api/volunteers/tasks/:id/status
// @access  Private/Volunteer
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if task belongs to the volunteer (check assignedVolunteers array)
    const isAssigned = task.assignedVolunteers && task.assignedVolunteers.some(
      volunteerId => volunteerId.toString() === req.user.id
    );
    
    if (!isAssigned && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    task.status = status.toUpperCase();
    if (notes) task.notes = notes;

    if (status === 'IN_PROGRESS' && !task.startedAt) {
      task.startedAt = Date.now();
    } else if (status === 'COMPLETED') {
      task.completedAt = Date.now();
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task status',
    });
  }
};

// @desc    Get all volunteers (Admin)
// @route   GET /api/volunteers
// @access  Private/Admin
exports.getAllVolunteers = async (req, res) => {
  try {
    const { volunteerRole, isVerified } = req.query;
    
    const filter = { role: 'VOLUNTEER' };
    if (volunteerRole) filter.volunteerRole = volunteerRole.toUpperCase();
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    const volunteers = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching volunteers',
    });
  }
};

// @desc    Create task (Admin)
// @route   POST /api/volunteers/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating task',
    });
  }
};

// @desc    Get all tasks (Admin)
// @route   GET /api/volunteers/tasks
// @access  Private/Admin
exports.getAllTasks = async (req, res) => {
  try {
    const { status, taskType, volunteer } = req.query;
    
    const filter = {};
    if (status) filter.status = status.toUpperCase();
    if (taskType) filter.taskType = taskType.toUpperCase();
    if (volunteer) filter.volunteer = volunteer;

    const tasks = await Task.find(filter)
      .populate('volunteer', 'name email phone volunteerRole')
      .populate('disaster', 'name type location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
    });
  }
};

// @desc    Update volunteer profile (role, skills, etc.)
// @route   PUT /api/volunteers/profile
// @access  Private/Volunteer
exports.updateVolunteerProfile = async (req, res) => {
  try {
    const { volunteerRole, skills, workingHours, experience } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if volunteer role is being changed
    if (volunteerRole && user.volunteerRole && user.volunteerRole !== volunteerRole.toUpperCase()) {
      // Check for active tasks
      const activeTasks = await Task.find({
        volunteer: req.user.id,
        status: { $in: ['ASSIGNED', 'IN_PROGRESS'] }
      });

      if (activeTasks.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change role while you have active tasks. Please complete or cancel your current tasks first.',
          activeTasksCount: activeTasks.length,
        });
      }
    }

    // Update volunteer-specific fields
    if (volunteerRole) user.volunteerRole = volunteerRole.toUpperCase();
    if (skills !== undefined) user.skills = skills;
    if (workingHours !== undefined) user.workingHours = workingHours;
    if (experience !== undefined) user.experience = experience;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Volunteer profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        volunteerRole: user.volunteerRole,
        skills: user.skills,
        workingHours: user.workingHours,
        experience: user.experience,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating volunteer profile',
    });
  }
};
