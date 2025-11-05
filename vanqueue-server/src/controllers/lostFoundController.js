const LostFound = require('../models/LostFound');

async function listLostFound(req, res, next) {
  try {
    const items = await LostFound.find()
      .populate({ path: 'driver', select: 'name phone' })
      .populate({
        path: 'trip',
        populate: { path: 'route', select: 'origin destination' },
      })
      .sort({ createdAt: -1 })
      .limit(100);

    const data = items.map((item) => ({
      id: item._id,
      item: item.item,
      description: item.description,
      createdAt: item.createdAt,
      driver: item.driver
        ? {
            id: item.driver._id,
            name: item.driver.name,
            phone: item.driver.phone,
          }
        : null,
      trip: item.trip
        ? {
            id: item.trip._id,
            departTime: item.trip.departTime,
            route: item.trip.route
              ? {
                  origin: item.trip.route.origin,
                  destination: item.trip.route.destination,
                }
              : null,
          }
        : null,
    }));

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listLostFound,
};
