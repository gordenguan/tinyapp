const getUserByEmail = (users, email) => {
  for (let userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
    return false;
  }
};

// Create a function named urlsForUser(id) which returns the URLs where the userID is equal to the id of the currently logged-in user.


const urlsForUser = (id, urlDatabase) => {
  let userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};


module.exports = { getUserByEmail, urlsForUser };