// src/routes/api/getID.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    //extract fragment ID from req.param
    const fragID = req.params.id;
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

      res.setHeader('Content-Length', fragment.size);

      res.status(200).send(fData);
    }
  } catch (error) {
    logger.error({ error }, 'Error handling request');
    res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
