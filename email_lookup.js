const getUserByEmail = (users, email) => {
  for (let userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
    return false;
  }
};

module.exports = { getUserByEmail };