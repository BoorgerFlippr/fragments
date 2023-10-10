// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const { Fragment } = require('../../../src/model/fragment');
const { contentType } = require('content-type');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Other routes will go here later on...

//support sending various content on the body
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // Check if the request body is a Buffer
      if (Buffer.isBuffer(req.body)) {
        const { type } = contentType.parse(req.headers['content-type']); // Parse the 'Content-Type' header

        // Check if the parsed content type is supported
        if (Fragment.isSupportedType(type)) {
          return true; // Return true if it's a supported content type
        }
      }
      return false; // Return false if the request body is not a Buffer or the content type is not supported
    },
  });

router.post('/fragments', rawBody(), require('./post'));
router.get('/fragments/:id', require('./getID'));

module.exports = router;
