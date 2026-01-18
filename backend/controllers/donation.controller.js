const Donation = require('../models/Donation.model');

// @desc    Create donation (Money)
// @route   POST /api/donations/money
// @access  Private/Donor
exports.donateMoney = async (req, res) => {
  try {
    const donationData = {
      donor: req.user.id,
      type: 'MONEY',
      amount: req.body.amount,
      donationType: req.body.donationType || 'GENERAL',
      disaster: req.body.disaster,
      transactionId: req.body.transactionId,
      status: 'VERIFIED',
    };

    const donation = await Donation.create(donationData);

    res.status(201).json({
      success: true,
      message: 'Monetary donation recorded successfully',
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing donation',
    });
  }
};

// @desc    Create donation (Items)
// @route   POST /api/donations/items
// @access  Private/Donor
exports.donateItems = async (req, res) => {
  try {
    const donationData = {
      donor: req.user.id,
      type: 'ITEMS',
      itemType: req.body.itemType.toUpperCase(),
      quantity: req.body.quantity,
      description: req.body.description,
      donationType: req.body.donationType || 'GENERAL',
      disaster: req.body.disaster,
      dropoffAddress: req.body.dropoffAddress,
      status: 'PENDING',
    };

    const donation = await Donation.create(donationData);

    res.status(201).json({
      success: true,
      message: 'Item donation submitted successfully. Awaiting verification.',
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting donation',
    });
  }
};

// @desc    Get donor's donation history
// @route   GET /api/donations/my-donations
// @access  Private/Donor
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('disaster', 'name type location')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      totalDonations: donations.length,
      totalMoney: donations
        .filter(d => d.type === 'MONEY')
        .reduce((sum, d) => sum + d.amount, 0),
      totalItems: donations.filter(d => d.type === 'ITEMS').length,
    };

    res.status(200).json({
      success: true,
      count: donations.length,
      stats,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations',
    });
  }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations
// @access  Private/Admin
exports.getAllDonations = async (req, res) => {
  try {
    const { type, status, disaster } = req.query;
    
    const filter = {};
    if (type) filter.type = type.toUpperCase();
    if (status) filter.status = status.toUpperCase();
    if (disaster) filter.disaster = disaster;

    const donations = await Donation.find(filter)
      .populate('donor', 'name email phone donorType')
      .populate('disaster', 'name type location')
      .sort({ createdAt: -1 });

    // Calculate total statistics
    const stats = {
      totalDonations: donations.length,
      totalMoneyDonated: donations
        .filter(d => d.type === 'MONEY')
        .reduce((sum, d) => sum + d.amount, 0),
      totalItemDonations: donations.filter(d => d.type === 'ITEMS').length,
    };

    res.status(200).json({
      success: true,
      count: donations.length,
      stats,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations',
    });
  }
};

// @desc    Verify donation (Admin)
// @route   PUT /api/donations/:id/verify
// @access  Private/Admin
exports.verifyDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    donation.status = 'VERIFIED';
    donation.verifiedBy = req.user.id;
    donation.verifiedAt = Date.now();

    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation verified successfully',
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying donation',
    });
  }
};

// @desc    Reject donation (Admin)
// @route   PUT /api/donations/:id/reject
// @access  Private/Admin
exports.rejectDonation = async (req, res) => {
  try {
    const { reason } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    donation.status = 'REJECTED';
    donation.rejectionReason = reason;
    donation.verifiedBy = req.user.id;
    donation.verifiedAt = Date.now();

    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation rejected',
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting donation',
    });
  }
};
