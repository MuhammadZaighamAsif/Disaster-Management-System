const AidRequest = require('../models/AidRequest.model');

// Aid limits from environment
const AID_LIMITS = {
  FOOD: parseInt(process.env.AID_LIMIT_FOOD) || 50,
  CLOTHES: parseInt(process.env.AID_LIMIT_CLOTHES) || 30,
  SHELTER: parseInt(process.env.AID_LIMIT_SHELTER) || 10,
  MEDICAL: parseInt(process.env.AID_LIMIT_MEDICAL) || 20,
};

// @desc    Create aid request
// @route   POST /api/aid-requests
// @access  Private/Victim
exports.createAidRequest = async (req, res) => {
  try {
    const aidData = {
      ...req.body,
      victim: req.user.id,
      status: 'PENDING', // All requests go to admin for approval
    };

    const aidRequest = await AidRequest.create(aidData);

    res.status(201).json({
      success: true,
      message: 'Aid request submitted successfully. Pending admin review.',
      data: aidRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating aid request',
    });
  }
};

// @desc    Get aid requests (for victim)
// @route   GET /api/aid-requests/my-requests
// @access  Private/Victim
exports.getMyAidRequests = async (req, res) => {
  try {
    const aidRequests = await AidRequest.find({ victim: req.user.id })
      .populate('disaster', 'name type location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: aidRequests.length,
      data: aidRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching aid requests',
    });
  }
};

// @desc    Get pending aid requests (Admin)
// @route   GET /api/aid-requests/pending
// @access  Private/Admin
exports.getPendingAidRequests = async (req, res) => {
  try {
    const { exceedsLimit } = req.query;

    const filter = { status: 'PENDING' };
    // If client explicitly asks to filter, honor it; otherwise include all pending
    if (exceedsLimit !== undefined) {
      filter.exceedsLimit = exceedsLimit === 'true';
    }

    const aidRequests = await AidRequest.find(filter)
      .populate('victim', 'name email phone address')
      .populate('disaster', 'name type location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: aidRequests.length,
      data: aidRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending aid requests',
    });
  }
};

// @desc    Get all aid requests (Admin)
// @route   GET /api/aid-requests
// @access  Private/Admin
exports.getAllAidRequests = async (req, res) => {
  try {
    const { status, aidType } = req.query;
    
    const filter = {};
    if (status) filter.status = status.toUpperCase();
    if (aidType) filter.aidType = aidType.toUpperCase();

    const aidRequests = await AidRequest.find(filter)
      .populate('victim', 'name email phone')
      .populate('disaster', 'name type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: aidRequests.length,
      data: aidRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching aid requests',
    });
  }
};

// @desc    Approve aid request (Admin)
// @route   PUT /api/aid-requests/:id/approve
// @access  Private/Admin
exports.approveAidRequest = async (req, res) => {
  try {
    const aidRequest = await AidRequest.findById(req.params.id);

    if (!aidRequest) {
      return res.status(404).json({
        success: false,
        message: 'Aid request not found',
      });
    }

    aidRequest.status = 'APPROVED';
    aidRequest.reviewedBy = req.user.id;
    aidRequest.reviewedAt = Date.now();

    await aidRequest.save();

    res.status(200).json({
      success: true,
      message: 'Aid request approved successfully',
      data: aidRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving aid request',
    });
  }
};

// @desc    Reject aid request (Admin)
// @route   PUT /api/aid-requests/:id/reject
// @access  Private/Admin
exports.rejectAidRequest = async (req, res) => {
  try {
    const { reason } = req.body;

    const aidRequest = await AidRequest.findById(req.params.id);

    if (!aidRequest) {
      return res.status(404).json({
        success: false,
        message: 'Aid request not found',
      });
    }

    aidRequest.status = 'REJECTED';
    aidRequest.rejectionReason = reason;
    aidRequest.reviewedBy = req.user.id;
    aidRequest.reviewedAt = Date.now();

    await aidRequest.save();

    res.status(200).json({
      success: true,
      message: 'Aid request rejected',
      data: aidRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting aid request',
    });
  }
};

// @desc    Update aid request status
// @route   PUT /api/aid-requests/:id/status
// @access  Private/Admin
exports.updateAidRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const aidRequest = await AidRequest.findById(req.params.id);

    if (!aidRequest) {
      return res.status(404).json({
        success: false,
        message: 'Aid request not found',
      });
    }

    aidRequest.status = status.toUpperCase();

    if (status === 'DELIVERED') {
      aidRequest.deliveredAt = Date.now();
    } else if (status === 'RECEIVED') {
      aidRequest.receivedAt = Date.now();
    }

    await aidRequest.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: aidRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status',
    });
  }
};
