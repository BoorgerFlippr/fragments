// src/routes/index.js

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

//authentication middleware
const { authenticate } = require('../auth');
const { createSuccessResponse } = require('../response');

const { Fragment } = require('../model/fragment');
const contentType = require('content-type');
/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response

  const data = {
    status: 'ok',
    author,
    githubUrl: 'https://github.com/BoorgerFlippr/fragments',
    version,
  };
  const successResponse = createSuccessResponse(data);
  res.status(200);
  res.json(successResponse);
});

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

router.post('/v1/fragments', rawBody(), require('./api/post'));

module.exports = router;
