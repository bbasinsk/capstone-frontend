require('@babel/register')({
  presets: ['next/babel'],
  ignore: ['node_modules', '.next']
});

// Import the rest of our application.
module.exports = require('./server.js');
