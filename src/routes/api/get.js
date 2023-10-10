// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let fragments;
  /**
   * const data = { fragments: [] };
  const successResponse = createSuccessResponse(data);
  res.status(200);
  res.json(successResponse);
   */

  try {
    fragments = await Fragment.byUser(req.user);
    const sRes = createSuccessResponse({ fragments });

    res.status(200).json(createSuccessResponse(sRes));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Not able to fetch fragments'));
  }
};
