// src/routes/api/getID.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

function extractExt(request) {
  const idx = request.lastIndexOf('.');

  var ext = '';

  if (idx !== -1 && idx < request.length - 1) {
    var suffix = request.substring(idx + 1);
    var prefix = '.';

    ext = prefix.concat(suffix);
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

function mime(request) {
  if (request === '.txt') {
    return 'text/plain';
  } else if (request === '.md') {
    return 'text/markdown';
  } else if (request === '.html') {
    return 'text/html';
  } else if (request === '.json') {
    return 'application/json';
  } else if (request === '.png') {
    return 'image/png';
  } else if (request === '.jpeg' || request === '.jpg') {
    return 'image/jpeg';
  } else if (request === 'webp') {
    return 'image/webp';
  } else if (request === 'gif') {
    return 'image/gif';
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
      let fType = fragment.type;
      let fSize = fragment.size;
      logger.debug('Before get data');
      let fData = await fragment.getData();
      logger.debug({ fData }, 'After get data');

      if (ext) {
        //check if conversion is valid
        if (Fragment.canConvert(fType, ext)) {
          //then convert
          logger.info({ fData }, 'BEFORE CONVERT');
          fData = await fragment.convertData(fData, ext, fragment);
          logger.info({ fData }, 'AFTER CONVERT');
          fType = mime(ext);
        } else {
          logger.debug('invalid conversion');
          return res.status(415).json(createErrorResponse(415, 'Invalid conversion'));
        }
      }

      res.setHeader('Content-Length', fSize);
      res.setHeader('Content-Type', fType);
      res.status(200).send(fData);
    }
  } catch (error) {
    logger.error({ error }, 'Error handling request');
    res.status(404).json(createErrorResponse(404, 'not found'));
  }
};
