var _ = require("lodash");
//global.expect = require('chai').expect
//var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
//chai.use(chaiAsPromised);

module.exports = {
  event: function(contract, filter){
    return new Promise(function(resolve, reject){
      var evt = contract[filter.event]();

      evt.watch();
      evt.get(function(err, logs){
        var log = _.filter(logs, filter);
	      if(!_.isEmpty(log)){
          resolve(log);
	      } else {
	        throw Error("Failed to find event " + filter.event);
	      }
      });

      evt.stopWatching();
    });
  }
}

/*
expect.extend({
  toBeValidProductProperty(received, expected) {
    const pass = received == shouldBe;
    if (!pass) {
      return {
        message: () => `recevied ${received} does not match ${expected}`,
        pass: false,
      };
    }
    return {
      message: () => `received ${recevied} matches ${expected}`,
      pass: true,
    };
  },
});
*/
