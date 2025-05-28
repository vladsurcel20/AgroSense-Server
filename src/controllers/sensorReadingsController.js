const { SensorReading, Sensor, GreenHouse } = require('../models/associations');
const { Op, Sequelize } = require('sequelize');




exports.getSensorReadings = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sensorId, startDate, endDate } = req.query;

    // Build filter
    const where = {};
    if (sensorId) where.sensorId = sensorId;

    // Filter by date range
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt[Op.gte] = new Date(startDate);
      if (endDate) where.recordedAt[Op.lte] = new Date(endDate);
    }

    // Only readings for user's sensors
    const sensors = await Sensor.findAll({ where: { userId } });
    const userSensorIds = sensors.map(s => s.id);
    if (!sensorId) {
      where.sensorId = { [Op.in]: userSensorIds };
    } else if (!userSensorIds.includes(Number(sensorId))) {
      return res.status(403).json({ message: 'Access denied to this sensor' });
    }

    const readings = await SensorReading.findAll({
      where,
    //   order: [['recordedAt', 'DESC']]
    });

    return res.status(200).json(readings);
  } catch (error) {
    console.error('Error fetching sensor readings:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.getChartData = async (req, res) => {
  try {
    const { sensorId, period = '24h' } = req.query;

    const intervals = {
      '24h': { 
        hours: 24, 
        groupBy: 'hour',
        dateFormat: '%Y-%m-%d %H:00:00',
        intervalQuery: 'INTERVAL 24 HOUR'
      },
      '7d': { 
        days: 7, 
        groupBy: 'day',
        dateFormat: '%Y-%m-%d 00:00:00',
        intervalQuery: 'INTERVAL 7 DAY'
      },
      '30d': { 
        days: 30, 
        groupBy: 'day',
        dateFormat: '%Y-%m-%d 00:00:00',
        intervalQuery: 'INTERVAL 30 DAY'
      }
    };

    const config = intervals[period];
    if (!config) {
      return res.status(400).json({ message: 'Invalid period specified' });
    }

    const results = await SensorReading.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('recordedAt'), config.dateFormat), 'time'],
        [Sequelize.fn('AVG', Sequelize.col('value')), 'avg_value'],
      ],
      where: {
        sensorId,
        recordedAt: { 
          [Op.gte]: Sequelize.literal(`NOW() - ${config.intervalQuery}`) 
        }
      },
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('recordedAt'), config.dateFormat)],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('recordedAt'), config.dateFormat), 'ASC']],
      raw: true
    });

    res.json(results.map(item => ({
      time: item.time,
      value: parseFloat(item.avg_value)
    })));
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getSensorMinMax = async (req, res) => {
  try {
    const { sensorId, period = '24h', all } = req.query;
    const greenhouseId = req.params.greenhouseId;

    const intervals = {
      '24h': 'INTERVAL 24 HOUR',
      '7d': 'INTERVAL 7 DAY',
      '30d': 'INTERVAL 30 DAY'
    };

    const intervalQuery = intervals[period];
    if (!intervalQuery) {
      return res.status(400).json({ message: 'Invalid period specified' });
    }

    if (sensorId && !all) {
      const result = await SensorReading.findOne({
        attributes: [
          [Sequelize.fn('MIN', Sequelize.col('value')), 'min_value'],
          [Sequelize.fn('MAX', Sequelize.col('value')), 'max_value'],
          [Sequelize.fn('COUNT', Sequelize.col('value')), 'reading_count']
        ],
        include: [{
          model: Sensor,
          as: "sensor",
          attributes: [],
          where: {
            greenhouseId
          }
        }],
        where: {
          sensorId,
          recordedAt: { 
            [Op.gte]: Sequelize.literal(`NOW() - ${intervalQuery}`) 
          }
        },
        raw: true
      });

      if (!result || result.reading_count === 0) {
        return res.json({
          min: 0,
          max: 100,
          hasData: false
        });
      }

      res.status(200).json({
        min: parseFloat(result.min_value),
        max: parseFloat(result.max_value),
        hasData: true,
        readingCount: parseInt(result.reading_count)
      });
    } else if (all && !sensorId) {

      const sensors = await Sensor.findAll({
        where: { greenhouseId },
        attributes: ['id'],
        raw: true
      });

      if (!sensors || sensors.length === 0) {
        return res.status(404).json({ message: 'No sensors found for this greenhouse' });
      }

      const results = await SensorReading.findAll({
        attributes: [
          'sensorId',
          [Sequelize.fn('MIN', Sequelize.col('value')), 'min_value'],
          [Sequelize.fn('MAX', Sequelize.col('value')), 'max_value'],
          [Sequelize.fn('COUNT', Sequelize.col('value')), 'reading_count']
        ],
        include: [{
          model: Sensor,
          as: "sensor",
          attributes: [],
          where: {
            greenhouseId
          }
        }],
        where: {
          recordedAt: { 
            [Op.gte]: Sequelize.literal(`NOW() - ${intervalQuery}`) 
          }
        },
        group: ['sensorId'],
        raw: true
      });

      const response = sensors.map(sensor => {
        const sensorData = results.find(item => item.sensorId === sensor.id);
      
        return sensorData 
          ? {
              sensorId: sensor.id,
              min: parseFloat(sensorData.min_value),
              max: parseFloat(sensorData.max_value),
              hasData: true,
              readingsCount: parseInt(sensorData.reading_count)
            }
          : {
              sensorId: sensor.id,
              min: 0,      
              max: 100,    
              hasData: false,
              readingsCount: 0
            };
       });

      res.status(200).json(response);
    } else {
      return res.status(400).json({ message: 'Invalid request' });
    }
  } catch (error) {
    console.error('Error fetching sensor min/max:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
