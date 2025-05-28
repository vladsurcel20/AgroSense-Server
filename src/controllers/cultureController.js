const { Culture } = require('../models/associations');

// Get all cultures
exports.getAllCultures = async (req, res) => {
  try {
    const cultures = await Culture.findAll({ where: { isActive: true } });
    return res.status(200).json(cultures);
  } catch (error) {
    console.error('Error fetching cultures:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get culture by ID
exports.getCultureById = async (req, res) => {
  try {
    const { id } = req.params;
    const culture = await Culture.findOne({ where: { id, isActive: true } });
    if (!culture) {
      return res.status(404).json({ message: 'Culture not found' });
    }
    return res.status(200).json(culture);
  } catch (error) {
    console.error('Error fetching culture:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Patch (partial update) culture
exports.patchCulture = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const culture = await Culture.findOne({ where: { id, isActive: true } });
    if (!culture) {
      return res.status(404).json({ message: 'Culture not found' });
    }

    Object.keys(updates).forEach(key => {
      if (key in culture) {
        culture[key] = updates[key];
      }
    });

    await culture.save();
    return res.status(200).json(culture);
  } catch (error) {
    console.error('Error updating culture:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete (soft delete) culture
exports.deleteCulture = async (req, res) => {
  try {
    const { id } = req.params;
    const culture = await Culture.findOne({ where: { id, isActive: true } });
    if (!culture) {
      return res.status(404).json({ message: 'Culture not found' });
    }
    culture.isActive = false;
    await culture.save();
    return res.status(200).json({ message: 'Culture deleted successfully' });
  } catch (error) {
    console.error('Error deleting culture:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create culture
exports.createCulture = async (req, res) => {
  try {
    const {
      name,
      minTempAir, maxTempAir,
      minTempSoil, maxTempSoil,
      minHumAir, maxHumAir,
      minHumSoil, maxHumSoil,
      minLight, maxLight
    } = req.body;

    if (
      !name ||
      minTempAir === undefined || maxTempAir === undefined ||
      minTempSoil === undefined || maxTempSoil === undefined ||
      minHumAir === undefined || maxHumAir === undefined ||
      minHumSoil === undefined || maxHumSoil === undefined ||
      minLight === undefined || maxLight === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const culture = await Culture.create({
      name,
      minTempAir, maxTempAir,
      minTempSoil, maxTempSoil,
      minHumAir, maxHumAir,
      minHumSoil, maxHumSoil,
      minLight, maxLight
    });

    return res.status(201).json(culture);
  } catch (error) {
    console.error('Error creating culture:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};