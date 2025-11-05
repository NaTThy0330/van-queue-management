const mongoose = require('mongoose');
const config = require('../config/env');
const { connectDatabase } = require('../config/database');
const User = require('../models/User');
const Route = require('../models/Route');
const Van = require('../models/Van');
const Trip = require('../models/Trip');
const logger = require('../utils/logger');

async function ensureAdminUser() {
  const existingAdmin = await User.findOne({ email: config.adminDefaultEmail });
  if (existingAdmin) {
    logger.info('Admin user already exists');
    return existingAdmin;
  }

  const passwordHash = await User.hashPassword(config.adminDefaultPassword);
  const adminUser = await User.create({
    name: 'System Administrator',
    email: config.adminDefaultEmail,
    phone: '0000000000',
    passwordHash,
    role: 'admin',
  });
  logger.info('Admin user created');
  return adminUser;
}

async function seedRoutes() {
  const routes = [
    { origin: 'Thammasat University', destination: 'Victory Monument', distanceKm: 40 },
    { origin: 'Thammasat University', destination: 'Chatuchak', distanceKm: 35 },
    { origin: 'Thammasat University', destination: 'Future Park', distanceKm: 15 },
  ];

  for (const route of routes) {
    await Route.updateOne(route, route, { upsert: true });
  }
  logger.info('Routes seeded');
}

async function seedVanAndTrip(adminUser) {
  const van = await Van.findOneAndUpdate(
    { plateNumber: 'TMP-2025' },
    {
      plateNumber: 'TMP-2025',
      model: 'Toyota Commuter',
      seatCapacity: 13,
      driver: adminUser._id,
      status: 'active',
    },
    { upsert: true, new: true },
  );

  const route = await Route.findOne({ destination: 'Victory Monument' });
  if (!route) {
    logger.warn('Skipping trip seed: route not found');
    return;
  }

  const departTime = new Date();
  departTime.setHours(departTime.getHours() + 2);

  await Trip.findOneAndUpdate(
    { route: route._id, van: van._id },
    {
      route: route._id,
      van: van._id,
      departTime,
      status: 'scheduled',
    },
    { upsert: true, new: true },
  );
  logger.info('Sample van and trip seeded');
}

async function runSeed() {
  try {
    await connectDatabase();
    const adminUser = await ensureAdminUser();
    await seedRoutes();
    await seedVanAndTrip(adminUser);
  } catch (error) {
    logger.error('Seed failed', error);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
}

runSeed();
