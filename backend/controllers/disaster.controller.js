const Disaster = require('../models/Disaster.model');

// @desc    Get all disasters
// @route   GET /api/disasters
// @access  Public
exports.getDisasters = async (req, res) => {
  try {
    const { status, city, type, severity } = req.query;
    
    const filter = {};
    if (status) filter.status = status.toUpperCase();
    if (city) filter.city = new RegExp(city, 'i');
    if (type) filter.type = type.toUpperCase();
    if (severity) filter.severity = severity.toUpperCase();

    const disasters = await Disaster.find(filter)
      .populate('reportedBy', 'name email')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: disasters.length,
      data: disasters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching disasters',
    });
  }
};

// @desc    Get single disaster
// @route   GET /api/disasters/:id
// @access  Public
exports.getDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('verifiedBy', 'name');

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    res.status(200).json({
      success: true,
      data: disaster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching disaster',
    });
  }
};

// @desc    Search disasters
// @route   GET /api/disasters/search
// @access  Public
exports.searchDisasters = async (req, res) => {
  try {
    const { query, city, type, status } = req.query;

    const filter = {};
    
    if (query) {
      filter.$text = { $search: query };
    }
    
    if (city) filter.city = new RegExp(city, 'i');
    if (type) filter.type = type.toUpperCase();
    if (status) filter.status = status.toUpperCase();

    const disasters = await Disaster.find(filter)
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: disasters.length,
      data: disasters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching disasters',
    });
  }
};

// @desc    Report new disaster
// @route   POST /api/disasters/report
// @access  Private
exports.reportDisaster = async (req, res) => {
  try {
    const disasterData = {
      ...req.body,
      reportedBy: req.user.id,
      status: 'PENDING',
    };

    const disaster = await Disaster.create(disasterData);

    res.status(201).json({
      success: true,
      message: 'Disaster reported successfully. Pending verification.',
      data: disaster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reporting disaster',
    });
  }
};

// @desc    Add disaster (Admin)
// @route   POST /api/disasters
// @access  Private/Admin
exports.addDisaster = async (req, res) => {
  try {
    const disasterData = {
      ...req.body,
      reportedBy: req.user.id,
      verifiedBy: req.user.id,
      status: 'ACTIVE',
      verifiedAt: Date.now(),
    };

    const disaster = await Disaster.create(disasterData);

    res.status(201).json({
      success: true,
      message: 'Disaster added successfully',
      data: disaster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding disaster',
    });
  }
};

// @desc    Update disaster
// @route   PUT /api/disasters/:id
// @access  Private/Admin
exports.updateDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Disaster updated successfully',
      data: disaster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating disaster',
    });
  }
};

// @desc    Delete disaster
// @route   DELETE /api/disasters/:id
// @access  Private/Admin
exports.deleteDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findByIdAndDelete(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Disaster deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting disaster',
    });
  }
};

// @desc    Verify disaster (Admin)
// @route   PUT /api/disasters/:id/verify
// @access  Private/Admin
exports.verifyDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    disaster.status = 'ACTIVE';
    disaster.verifiedBy = req.user.id;
    disaster.verifiedAt = Date.now();

    await disaster.save();

    res.status(200).json({
      success: true,
      message: 'Disaster verified successfully',
      data: disaster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying disaster',
    });
  }
};

// @desc    Reject disaster (Admin)
// @route   PUT /api/disasters/:id/reject
// @access  Private/Admin
exports.rejectDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    disaster.status = 'REJECTED';
    disaster.verifiedBy = req.user.id;
    disaster.verifiedAt = Date.now();

    await disaster.save();

    res.status(200).json({
      success: true,
      message: 'Disaster rejected',
      data: disaster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting disaster',
    });
  }
};
