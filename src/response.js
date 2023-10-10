// src/response.js

module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    ...data,
  };
};

module.exports.createErrorResponse = function (code, message) {
  // TODO ...
  return {
    status: 'error',
    error: {
      code: code,
      message: message,
    },
  };
};
