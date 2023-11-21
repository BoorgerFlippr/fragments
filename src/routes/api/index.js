// src/routes/api/index.js

const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
//const logger = require('../../logger');

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

//support sending various content on the body
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Other routes will go here later on...
router.get(['/fragments/:id', '/fragments/:id.html'], require('./getID'));

//assignment 2 routes
router.get('/fragments/:id/info', require('./getIdInfo'));

router.post('/fragments', rawBody(), require('./post'));

module.exports = router;
