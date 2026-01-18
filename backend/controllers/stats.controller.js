const User = require('../models/User.model');
const AidRequest = require('../models/AidRequest.model');
const Donation = require('../models/Donation.model');
const Disaster = require('../models/Disaster.model');

// @desc    Get platform statistics
// @route   GET /api/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    // Count users by role
    const victimCount = await User.countDocuments({ role: 'VICTIM' });
    const volunteerCount = await User.countDocuments({ role: 'VOLUNTEER' });
    const donorCount = await User.countDocuments({ role: 'DONOR' });
    
    // Count disasters (all statuses)
    const disasterCount = await Disaster.countDocuments();
    
    // Count victims helped (aid requests that are approved or completed)
    const victimsHelpedCount = await AidRequest.countDocuments({
      status: { $in: ['APPROVED', 'ALLOCATED', 'DELIVERED', 'RECEIVED'] }
    });
    
    // Count donations
    const totalDonations = await Donation.countDocuments({ status: 'VERIFIED' });
    
    res.status(200).json({
      success: true,
      data: {
        victimsHelped: victimsHelpedCount || victimCount,
        activeVolunteers: volunteerCount,
        donors: donorCount,
        disastersManaged: disasterCount,
        totalDonations: totalDonations
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};
