const User = require('../models/User.model');
const Disaster = require('../models/Disaster.model');
const AidRequest = require('../models/AidRequest.model');
const Donation = require('../models/Donation.model');
const Task = require('../models/Task.model');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'DONOR' });
    const totalVolunteers = await User.countDocuments({ role: 'VOLUNTEER' });
    const totalVictims = await User.countDocuments({ role: 'VICTIM' });

    // Disaster statistics
    const totalDisasters = await Disaster.countDocuments();
    const activeDisasters = await Disaster.countDocuments({ status: 'ACTIVE' });
    const pendingDisasters = await Disaster.countDocuments({ status: 'PENDING' });

    // Aid request statistics
    const totalAidRequests = await AidRequest.countDocuments();
    const pendingAidRequests = await AidRequest.countDocuments({ status: 'PENDING', exceedsLimit: true });
    const approvedAidRequests = await AidRequest.countDocuments({ status: 'APPROVED' });

    // Donation statistics
    const totalDonations = await Donation.countDocuments();
    const moneyDonations = await Donation.find({ type: 'MONEY', status: 'VERIFIED' });
    const totalMoneyDonated = moneyDonations.reduce((sum, d) => sum + d.amount, 0);

    // Task statistics
    const totalTasks = await Task.countDocuments();
    const availableTasks = await Task.countDocuments({ status: 'AVAILABLE' });
    const completedTasks = await Task.countDocuments({ status: 'COMPLETED' });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          donors: totalDonors,
          volunteers: totalVolunteers,
          victims: totalVictims,
        },
        disasters: {
          total: totalDisasters,
          active: activeDisasters,
          pending: pendingDisasters,
        },
        aidRequests: {
          total: totalAidRequests,
          pending: pendingAidRequests,
          approved: approvedAidRequests,
        },
        donations: {
          total: totalDonations,
          totalMoneyDonated,
        },
        tasks: {
          total: totalTasks,
          available: availableTasks,
          completed: completedTasks,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isVerified } = req.query;
    
    const filter = {};
    if (role) filter.role = role.toUpperCase();
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
    });
  }
};

// @desc    Verify user
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User verified successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying user',
    });
  }
};

// @desc    Deactivate user
// @route   PUT /api/admin/users/:id/deactivate
// @access  Private/Admin
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating user',
    });
  }
};
