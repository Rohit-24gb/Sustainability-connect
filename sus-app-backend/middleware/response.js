const responseMiddleware = (req, res, next) => {
  res.success = (data = {}, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      ...data
    });
  };

  res.fail = (message = "Request failed", statusCode = 400, errors) => {
    const body = { success: false, message };

    if (errors) {
      body.errors = errors;
    }

    return res.status(statusCode).json(body);
  };

  next();
};

module.exports = responseMiddleware;
