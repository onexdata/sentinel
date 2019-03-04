const debug = require('debug')('acter:service:ui');
module.exports = function ( appConfig, config = {show:{}}, persistence ) {
  return {
    async find(params) {
      return 5;
    },
    // Return specific status about the server...
    async get(id, params, context) {
    },
    async create(data, params) {
      console.log(`CREATING ALERT ${data.name} ... \n${params}`)
      // Here is where we contact PagerDuty or something similar with the alert type...
      // app.services.pagerDuty.create(data, params)
    },
    async update(id, data, params) {

    },
    async patch(id, data, params) {

    },
    async remove(id, params) {

    },
    setup(app, path) {
      // console.log('Setup:', app)
    }
  };
};