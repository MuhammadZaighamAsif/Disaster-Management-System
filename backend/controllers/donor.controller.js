const User = require('../models/User.model');

// @desc    Get all donors (Admin)
// @route   GET /api/donors
// @access  Private/Admin
exports.getAllDonors = async (req, res) => {
  try {
    const { donorType, isVerified } = req.query;
    
    const filter = { role: 'DONOR' };
    if (donorType) filter.donorType = donorType.toUpperCase();
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    const donors = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donors',
    });
  }
};

// @desc    Verify donor (Admin)
// @route   PUT /api/donors/:id/verify
// @access  Private/Admin
exports.verifyDonor = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    if (donor.role !== 'DONOR') {
      return res.status(400).json({
        success: false,
        message: 'User is not a donor',
      });
    }

    donor.isVerified = true;
    await donor.save();

    res.status(200).json({
      success: true,
      message: 'Donor verified successfully',
      data: donor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying donor',
    });
  }
};

// @desc    Unverify donor (Admin)
// @route   PUT /api/donors/:id/unverify
// @access  Private/Admin
exports.unverifyDonor = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    donor.isVerified = false;
    await donor.save();

    res.status(200).json({
      success: true,
      message: 'Donor verification removed',
      data: donor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating donor',
    });
  }
};
