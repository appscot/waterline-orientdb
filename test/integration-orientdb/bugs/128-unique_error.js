var assert = require('assert');

var self = this;

describe('Bug #128: Error code for uniqueness validation is unknown', function() {
  before(function (done) {

    var fixtures = {
      UserFixture : {
        identity : 'user',
        attributes : {
          email : {
            type : 'email',
            unique: true
          }
        }
      }
    };

    CREATE_TEST_WATERLINE(self, 'test_bug_128', fixtures, done);
  });
  after(function (done) {
    DELETE_TEST_WATERLINE('test_bug_128', done);
  });

  describe('create user', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////


    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return E_VALIDATION error', function(done) {
      self.collections.User.create({email: 'email@example.com' }, function(err, user1) {
        if(err) { return done(err); }
        assert(user1);
        self.collections.User.create({email: 'email@example.com' }, function(err, user1) {
          assert(err.code);
          assert.equal(err.code, 'E_VALIDATION');
          done();
        });
      });
    });

  });
});
