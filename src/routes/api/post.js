const { Fragment } = require('../../../src/model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug('in post route');
  const API_URL = process.env.API_URL || req.headers.host;

  try {
    if (!req.headers['content-type']) {
      return res.status(400).json({ message: 'Content-Type header is missing' });
    }

    const contentTypeHeader = req.headers['content-type'];

    if (!Fragment.isSupportedType(contentTypeHeader)) {
      return res.status(415).json({ message: 'Unsupported content type' });
    }

    if (Buffer.isBuffer(req.body)) {
      logger.debug('parsed');
    } else {
      return res.status(415).json({ message: 'Unsupported content type (not a buffer)' });
    }

    const data = req.body;

    logger.debug({ data }, 'this is data');

    const fragment = new Fragment({
      ownerId: req.user,
      type: contentTypeHeader,
      size: data.length,
    });

    await fragment.setData(data);

    await fragment.save();

    let nFragment = new Fragment(await Fragment.byId(req.user, fragment.id));

    res.setHeader('Location', `${API_URL}/v1/fragments/${fragment.id}`);
    res.setHeader('Content-Type', fragment.type);

    const n = nFragment.size;
    logger.debug({ n }, 'THIS IS SIZE');
    res.setHeader('Content-Length', nFragment.size);

    logger.error({ fragment }, 'CREATED FRAGMENT, look here');
    const response = createSuccessResponse({ fragment });
    logger.debug({ response }, 'RESPONSE FROM POST');

    return res.status(201).json(response);
  } catch (err) {
    logger.debug('look here 1');
    logger.error(err);
    res.status(400).json(createErrorResponse(400, 'Something went wrong: ', err));
  }
};
