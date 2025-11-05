const Route = require('../models/Route');
const Trip = require('../models/Trip');

async function listRoutes(req, res, next) {
  try {
    const routes = await Route.find().sort({ origin: 1, destination: 1 });
    return res.json({
      success: true,
      data: routes.map((route) => ({
        id: route._id,
        origin: route.origin,
        destination: route.destination,
        distanceKm: route.distanceKm,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

async function listTripsByRoute(req, res, next) {
  try {
    const { id } = req.params;
    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    }

    const trips = await Trip.find({ route: route._id })
      .populate({ path: 'van', select: 'plateNumber seatCapacity status' })
      .sort({ departTime: 1 });

    return res.json({
      success: true,
      data: trips.map((trip) => ({
        id: trip._id,
        departTime: trip.departTime,
        status: trip.status,
        van: trip.van
          ? {
              id: trip.van._id,
              plateNumber: trip.van.plateNumber,
              seatCapacity: trip.van.seatCapacity,
              status: trip.van.status,
            }
          : null,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listRoutes,
  listTripsByRoute,
};
