// src/routes/api/getID.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

function extractExt(request) {
  const idx = request.lastIndexOf('.');

  var ext = '';

  if (idx !== -1 && idx < request.length - 1) {
    ext = request.substring(idx + 1);
  }

  return ext;
}

function removeExt(request) {
  const idx = request.lastIndexOf('.');

  if (idx !== -1 && idx < request.length - 1) {
    const withoutExt = request.substring(0, idx);
    return withoutExt;
  } else {
    return request;
  }
}

module.exports = async (req, res) => {
  try {
    //extract ext
    const ext = extractExt(req.params.id);
    logger.info({ ext }, 'THIS IS EXTENSION');

    //extract fragment ID from req.param
    const fragID = removeExt(req.params.id);
    logger.debug({ fragID }, 'FRAGMENT ID');

    //extract owner ID
    const ownerID = req.user;
    logger.debug({ ownerID }, 'OWNER ID');

    //get the fragment
    logger.debug({ ownerID, fragID }, 'Before getting fragment');
    let fragment = new Fragment(await Fragment.byId(ownerID, fragID));
    logger.debug({ fragment }, 'after getting fragment');

    if (!fragment) {
      res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    } else {
      //set res headers
      logger.debug('Set header 1');
      res.setHeader('Content-Type', fragment.type);
      logger.debug('after Set header 1');

      logger.debug('Before get data');
      let fData = await fragment.getData();
      logger.debug({ fData }, 'After get data');

      if (ext) {
        logger.info({ fData }, 'BEFORE CONVERT');
        fData = await fragment.convertData(fData, ext, fragment);
        logger.info({ fData }, 'AFTER CONVERT');
      }

      res.setHeader('Content-Length', fragment.size);

      res.status(200).send(fData);
    }
  } catch (error) {
    logger.error({ error }, 'Error handling request');
    res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
