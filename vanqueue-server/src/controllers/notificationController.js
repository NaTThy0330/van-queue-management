const notificationService = require('../services/notificationService');

async function registerToken(req, res, next) {
  try {
    const { token, platform } = req.body;
    const userAgent = req.headers['user-agent'];
    await notificationService.registerToken({
      userId: req.user._id,
      token,
      platform,
      userAgent,
    });

    return res.status(201).json({
      success: true,
      message: 'Notification token registered',
    });
  } catch (error) {
    return next(error);
  }
}

async function unregisterToken(req, res, next) {
  try {
    const { token } = req.body;
    await notificationService.removeToken(token);
    return res.json({
      success: true,
      message: 'Notification token removed',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  registerToken,
  unregisterToken,
};
