'use strict';

'use strict';
module.exports = () => {
  const config = {};

  config.vuessr = {
    mergeLocals: false,
  };

  config.security = {
    csrf: {
      enable: false
    }
  };

  return config;
};
