const User = require('../models/User.model');

// @desc    Get all victims (Admin)
// @route   GET /api/victims
// @access  Private/Admin
exports.getAllVictims = async (req, res) => {
  try {
    const { isVerified } = req.query;
    
    const filter = { role: 'VICTIM' };
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    const victims = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: victims.length,
      data: victims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching victims',
    });
  }
};

// @desc    Get single victim details (Admin)
// @route   GET /api/victims/:id
// @access  Private/Admin
exports.getVictim = async (req, res) => {
  try {
    const victim = await User.findById(req.params.id);

    if (!victim) {
      return res.status(404).json({
        success: false,
        message: 'Victim not found',
      });
    }

    if (victim.role !== 'VICTIM') {
      return res.status(400).json({
        success: false,
        message: 'User is not a victim',
      });
    }

    res.status(200).json({
      success: true,
      data: victim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching victim',
    });
  }
};
