const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080;    //default port 8080
const { getUserByEmail } = require('./email_lookup');

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// create users database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/login', (req, res) => {
  if (!req.user_id) {
    res.render('urls_login');
  }
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  if (!req.user_id) {
    res.render('urls_registration');
  }
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // handle error
  if (email === '') {
    return res.status(400).send('Please enter valid email');
  }
  if (password === '') {
    return res.status(400).send('Please enter valid password');
  }
  // create helper.js and import to current file 
  const userCheck = getUserByEmail(users, email);
  if (userCheck) {
    return res.status(400).send('Email already exist');
  }

  // create a new user:
  let userId = generateRandomString();
  let newUser = {
    id: userId,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  // add newuser into the users database
  users[userId] = newUser;

  // set a user_id cookie
  req.session.user_id = userId;

  res.redirect("/urls");
});

app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id] // Pass the entire user object to templateVars
  };
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  res.render('urls_index', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = getUserByEmail(users, email);

  if (email === '') {
    return res.status(400).send('Please enter valid email');
  }
  if (password === '') {
    return res.status(400).send('Please enter valid password');
  }
  if (!user) {
    return res.status(403).send('Please enter valid email');
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send('Please enter valid password');
  }

  req.session.user_id = user.id;

  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/login');
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  res.redirect('/urls/' + shortURL);
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newLongURL;
  res.redirect("/urls");
});


app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});


app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.session.user_id]
  };
  res.render('urls_show', templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  let longURL = urlDatabase[id];
  if (!longURL) {
    res.send('ShortURL does not exist');
  }

  const regex = /^http(s)?:\/\//;
  longURL = longURL.match(regex) ? longURL : `http://${longURL}`;
  res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});