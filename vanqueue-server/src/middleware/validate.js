const validate = (schema) => (req, res, next) => {
  const options = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  return next();
};

module.exports = validate;
