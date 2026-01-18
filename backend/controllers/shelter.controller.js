const Shelter = require('../models/Shelter.model');

// @desc    Offer shelter
// @route   POST /api/shelters
// @access  Private/Donor
exports.offerShelter = async (req, res) => {
  try {
    const shelterData = {
      ...req.body,
      donor: req.user.id,
      bedsOccupied: 0,
      status: 'AVAILABLE',
    };

    const shelter = await Shelter.create(shelterData);

    res.status(201).json({
      success: true,
      message: 'Shelter offered successfully',
      data: shelter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error offering shelter',
    });
  }
};

// @desc    Get available shelters
// @route   GET /api/shelters/available
// @access  Public
exports.getAvailableShelters = async (req, res) => {
  try {
    const { city, disaster } = req.query;
    
    const filter = { status: { $in: ['AVAILABLE', 'FULL'] } };
    if (city) filter.city = new RegExp(city, 'i');
    if (disaster) filter.disaster = disaster;

    const shelters = await Shelter.find(filter)
      .populate('disaster', 'name type location')
      .populate('donor', 'name phone')
      .sort({ bedsAvailable: -1 });

    res.status(200).json({
      success: true,
      count: shelters.length,
      data: shelters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelters',
    });
  }
};

// @desc    Get donor's shelters
// @route   GET /api/shelters/my-shelters
// @access  Private/Donor
exports.getMyShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find({ donor: req.user.id })
      .populate('disaster', 'name type location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shelters.length,
      data: shelters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelters',
    });
  }
};

// @desc    Get all shelters (Admin)
// @route   GET /api/shelters
// @access  Private/Admin
exports.getAllShelters = async (req, res) => {
  try {
    const { city, status, disaster } = req.query;
    
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (status) filter.status = status.toUpperCase();
    if (disaster) filter.disaster = disaster;

    const shelters = await Shelter.find(filter)
      .populate('donor', 'name email phone')
      .populate('disaster', 'name type location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shelters.length,
      data: shelters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelters',
    });
  }
};

// @desc    Update shelter
// @route   PUT /api/shelters/:id
// @access  Private/Donor
exports.updateShelter = async (req, res) => {
  try {
    let shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found',
      });
    }

    // Check if user is the donor
    if (shelter.donor.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this shelter',
      });
    }

    shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Shelter updated successfully',
      data: shelter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating shelter',
    });
  }
};

// @desc    Update shelter occupancy
// @route   PUT /api/shelters/:id/occupancy
// @access  Private/Admin
exports.updateShelterOccupancy = async (req, res) => {
  try {
    const { bedsOccupied } = req.body;

    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found',
      });
    }

    if (bedsOccupied > shelter.bedsAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Occupied beds cannot exceed available beds',
      });
    }

    shelter.bedsOccupied = bedsOccupied;
    await shelter.save();

    res.status(200).json({
      success: true,
      message: 'Occupancy updated successfully',
      data: shelter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating occupancy',
    });
  }
};

// @desc    Delete shelter
// @route   DELETE /api/shelters/:id
// @access  Private/Donor/Admin
exports.deleteShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found',
      });
    }

    // Check if user is the donor or admin
    if (shelter.donor.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this shelter',
      });
    }

    await shelter.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Shelter deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting shelter',
    });
  }
};
