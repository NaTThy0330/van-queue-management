const path = require('path');
const mongoose = require('mongoose');
const Queue = require('../models/Queue');
const Payment = require('../models/Payment');
const Trip = require('../models/Trip');
const TicketHistory = require('../models/TicketHistory');
const notificationService = require('../services/notificationService');

async function reserveQueue(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { tripId, queueType = 'normal', amount } = req.body;
    const slipFile = req.file;

    if (!slipFile) {
      return res.status(400).json({
        success: false,
        message: 'Payment slip is required',
      });
    }

    session.startTransaction();

    const trip = await Trip.findById(tripId).session(session);
    if (!trip) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    const existingQueue = await Queue.findOne({
      passenger: req.user._id,
      trip: trip._id,
    }).session(session);

    if (existingQueue) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: 'You already have a reservation for this trip',
      });
    }

    const queueDocs = await Queue.create(
      [
        {
          passenger: req.user._id,
          trip: trip._id,
          queueType,
          status: 'pending',
        },
      ],
      { session },
    );

    const paymentDocs = await Payment.create(
      [
        {
          queue: queueDocs[0]._id,
          amount,
          slipUrl: path.relative(process.cwd(), slipFile.path).replace(/\\/g, '/'),
          status: 'waiting',
        },
      ],
      { session },
    );

    queueDocs[0].payment = paymentDocs[0]._id;
    await queueDocs[0].save({ session });

    await session.commitTransaction();

    notificationService
      .notifyReservationSubmitted({
        userId: req.user._id,
        tripId: trip._id,
        queueId: queueDocs[0]._id,
      })
      .catch(() => {
        // ignore errors; already logged inside service
      });

    return res.status(201).json({
      success: true,
      message: 'Reservation submitted. Awaiting verification.',
      data: {
        queueId: queueDocs[0]._id,
        paymentId: paymentDocs[0]._id,
        status: queueDocs[0].status,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    session.endSession();
  }
}

async function listQueues(req, res, next) {
  try {
    const queues = await Queue.find({ passenger: req.user._id })
      .populate({
        path: 'trip',
        populate: [
          { path: 'route', select: 'origin destination distanceKm' },
          { path: 'van', select: 'plateNumber seatCapacity' },
        ],
      })
      .populate('payment')
      .sort({ createdAt: -1 });

    const data = queues.map((queue) => ({
      id: queue._id,
      status: queue.status,
      queueType: queue.queueType,
      seatNo: queue.seatNo,
      createdAt: queue.createdAt,
      trip: queue.trip
        ? {
            id: queue.trip._id,
            departTime: queue.trip.departTime,
            status: queue.trip.status,
            route: queue.trip.route
              ? {
                  origin: queue.trip.route.origin,
                  destination: queue.trip.route.destination,
                  distanceKm: queue.trip.route.distanceKm,
                }
              : null,
            van: queue.trip.van
              ? {
                  id: queue.trip.van._id,
                  plateNumber: queue.trip.van.plateNumber,
                  seatCapacity: queue.trip.van.seatCapacity,
                }
              : null,
          }
        : null,
      payment: queue.payment
        ? {
            id: queue.payment._id,
            amount: queue.payment.amount,
            status: queue.payment.status,
            slipUrl: queue.payment.slipUrl,
            verifiedBy: queue.payment.verifiedBy,
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

async function ticketHistory(req, res, next) {
  try {
    const tickets = await TicketHistory.find({ passenger: req.user._id })
      .populate({
        path: 'trip',
        populate: { path: 'route', select: 'origin destination distanceKm' },
      })
      .sort({ issuedAt: -1 });

    const data = tickets.map((ticket) => ({
      id: ticket._id,
      ticketCode: ticket.ticketCode,
      issuedAt: ticket.issuedAt,
      trip: ticket.trip
        ? {
            id: ticket.trip._id,
            departTime: ticket.trip.departTime,
            status: ticket.trip.status,
            route: ticket.trip.route
              ? {
                  origin: ticket.trip.route.origin,
                  destination: ticket.trip.route.destination,
                  distanceKm: ticket.trip.route.distanceKm,
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
  reserveQueue,
  listQueues,
  ticketHistory,
};
