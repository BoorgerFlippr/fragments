// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
// Create a router on which to mount our API endpoints
const router = express.Router();
//const logger = require('../../logger');
// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Other routes will go here later on...
router.get(['/fragments/:id', '/fragments/:id.html'], require('./getID'));

//assignment 2 routes
router.get('/fragments/:id/info', require('./getIdInfo'));

module.exports = router;
