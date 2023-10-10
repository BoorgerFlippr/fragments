const { Fragment } = require('../../../src/model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // API_URL
  const API_URL = process.env.API_URL || req.headers.host;

  try {
    // Check if the content type header exists
    if (!req.headers['content-type']) {
      return res.status(400).json({ message: 'Content-Type header is missing' });
    }

    // Extract the content type from the request headers
    const contentTypeHeader = req.headers['content-type'];

    // Check if the content type is supported
    if (!Fragment.isSupportedType(contentTypeHeader)) {
      return res.status(415).json({ message: 'Unsupported content type' });
    }

    // Create the fragment
    const fragment = new Fragment({
      ownerId: req.user,
      type: contentTypeHeader, // Use the content type from the header
      size: req.body.byteLength,
    });

    // Set data into fragment

    await fragment.setData(req.body);

    await fragment.save();

    // Set up response
    res.setHeader('Location', `${API_URL}/v1/fragments/${fragment.id}`);
    res.setHeader('Content-Type', fragment.type);

    logger.error({ fragment }, 'CREATED FRAGMENT');
    const response = createSuccessResponse({ fragment });
    logger.debug({ response }, 'RESPONSE FROM POST');

    return res.status(201).json(response);
  } catch (err) {
    // Catch error
    logger.error(err);
    res.status(400).json(createErrorResponse(400, 'Something went wrong: ', err));
  }
};
