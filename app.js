'use strict';
const fs = require('fs');
module.exports = app => {
  app.view.use('vue', require('./lib/view'));
};
