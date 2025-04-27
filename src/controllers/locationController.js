const { Location, GreenHouse } = require('../models/associations');
const { Sequelize } = require('sequelize');

exports.getAllLocations = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming authentication middleware sets req.user
    const includeCount = req.query.count === 'true';
    
    const locations = await Location.findAll({
      where: { 
        userId: userId,
        isActive: true 
      },
      attributes: {
        include: includeCount ? [
          [Sequelize.fn("COUNT", Sequelize.col("greenhouses.id")), "greenhouseCount"]
        ] : []
      },
      include: includeCount ? [{
        model: GreenHouse,
        as: "greenhouses",
        attributes: [],
        required: false // important if some locations have 0 greenhouses
      }] : [],
      group: includeCount ? ["Location.id"] : undefined
    });
    
    return res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const location = await Location.findOne({
      where: { 
        id: id,
        userId: userId,
        isActive: true 
      }
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    return res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { name, address, city } = req.body;
    const userId = req.user?.id;
    
    if (!name || !address || !city) {
      return res.status(400).json({ message: 'Mandatory informations are missing!' });
    }
    
    const newLocation = await Location.create({
      name,
      address,
      city,
      userId,
      lastVisited: new Date(),
      isActive: true
    });
    
    return res.status(201).json({message: "Location created succesfuly", location: newLocation});
  } catch (error) {
    console.error('Error creating location:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, isActive } = req.body;
    const userId = req.user?.id;
    
    const location = await Location.findOne({
      where: { 
        id: id,
        userId: userId
      }
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    if (name) location.name = name;
    if (address) location.address = address;
    if (city) location.city = city;
    if (isActive !== undefined) location.isActive = isActive;
    
    location.lastVisited = new Date();
    
    await location.save();
    
    return res.status(200).json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// "Delete" a location (soft delete by setting isActive to false)
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const location = await Location.findOne({
      where: { 
        id: id,
        userId: userId
      }
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    location.isActive = false;
    await location.save();
    
    return res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};