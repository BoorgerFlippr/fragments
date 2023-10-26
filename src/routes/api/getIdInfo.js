// src/routes/api/getIdInfo.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  let fragment;

  try {
    fragment = await Fragment.byId(req.user, req.params.id);
  } catch (err) {
    return res.status(400).json(createErrorResponse('Error requesting info'));
  }

  return res.status(200).json(createSuccessResponse({ fragment }));
};
