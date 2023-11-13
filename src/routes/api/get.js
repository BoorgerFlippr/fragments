// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let fragments;

  try {
    var sRes;

    if (req.query.expand === '1') {
      fragments = await Fragment.byUser(req.user, true);
      sRes = await createSuccessResponse({ fragments });
    } else {
      fragments = await Fragment.byUser(req.user);
      sRes = createSuccessResponse({ fragments });
    }

    res.status(200).json(createSuccessResponse(sRes));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Not able to fetch fragments'));
  }
};
