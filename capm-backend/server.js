const cds = require('@sap/cds');
const express = require('express');
const cors = require('cors');

cds.on('bootstrap', app => {
  // Allow CORS from all origins
  app.use(cors());

  // Optional: define a health check or landing page
  app.get('/', (req, res) => {
    res.send('CAP Backend is running 🚀');
  });

  // Optional: redirect to OData
  app.get('/api', (req, res) => {
    res.redirect('/odata/v4/catalog');
  });
});

module.exports = cds.server;
