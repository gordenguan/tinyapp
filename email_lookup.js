const getUserByEmail = (users, email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return false;
    }
    return true;
  }
};

module.exports = { getUserByEmail };