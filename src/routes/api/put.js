const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../../src/response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.error('in put route function');

  try {
    logger.error('check if content type is present');
    if (!req.headers['content-type']) {
      return res.status(400).json(createErrorResponse(400, 'Content-Type header is missing'));
    }

    const newContentTypeHeader = req.headers['content-type'];
    logger.error({ newContentTypeHeader }, 'content type from request');

    if (Buffer.isBuffer(req.body)) {
      logger.error('parsed');
    } else {
      return res.status(415).json(createErrorResponse(415, 'body not parsed'));
    }

    const newData = req.body;
    logger.error({ newData }, 'data from request');

    const fragment = new Fragment(await Fragment.byId(req.user, req.params.id));

    if (!fragment) {
      return res.status(404).json(createErrorResponse(404, 'fragment not found'));
    }
    logger.error({ fragment }, 'fragment to be updated');

    if (fragment.type != newContentTypeHeader) {
      return res.status(400).json(createErrorResponse(400, 'fragment content type does not match'));
    }

    logger.error('before set data');
    await fragment.setData(newData);
    logger.error('after set data');

    logger.error('before save');
    await fragment.save();
    logger.error('after save');

    res.status(201).json(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    logger.error('in catch statement');
    res.status(400).json(createErrorResponse(400, 'Something went wrong: ' + err));
  }
};
