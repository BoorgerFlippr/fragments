const { Fragment } = require('../../../src/model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const API_URL = process.env.API_URL || req.headers.host;

  try {
    if (!req.headers['content-type']) {
      return res.status(400).json({ message: 'Content-Type header is missing' });
    }

    const contentTypeHeader = req.headers['content-type'];

    if (!Fragment.isSupportedType(contentTypeHeader)) {
      return res.status(415).json({ message: 'Unsupported content type' });
    }

    const fragment = new Fragment({
      ownerId: req.user,
      type: contentTypeHeader,
      size: req.body.byteLength,
    });

    await fragment.setData(req.body);

    await fragment.save();

    res.setHeader('Location', `${API_URL}/v1/fragments/${fragment.id}`);
    res.setHeader('Content-Type', fragment.type);

    logger.error({ fragment }, 'CREATED FRAGMENT');
    const response = createSuccessResponse({ fragment });
    logger.debug({ response }, 'RESPONSE FROM POST');

    return res.status(201).json(response);
  } catch (err) {
    logger.error(err);
    res.status(400).json(createErrorResponse(400, 'Something went wrong: ', err));
  }
};
