const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com")
    const expectedUserID = "userRandomID";
    const actual = user.id;
    assert.equal(actual, expectedUserID)
  });

  it('should return undefined if email is not in user database', () => {
    const user = getUserByEmail(testUsers, "nick@example.com")
    const expectedUserID = undefined;
    const actual = user.email;
    assert.equal(actual, expectedUserID)
  }) 
});