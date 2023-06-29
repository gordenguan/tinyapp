const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;    //default port 8080

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// create users database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/register', (req, res) => {
  res.render('urls_registration');
});

// Create a POST /register endpoint
// This endpoint should add a new user object to the users database


app.post('/register', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  // create a new user:
  let userId = generateRandomString();
  let newUser = {
    id: userId,
    email,
    password
  };
  // add newuser into the users database
  users[userId] = newUser;

  // set a user_id cookie
  res.cookie('user_id', userId);

  //test by by checking the cookie in browser dev too and using console.log to check if user is added
  console.log(users);
  res.redirect("/urls");
});

app.get('/urls', (req, res) => {
  // Update all endpoints that currently pass a username value to the templates to pass the entire user object to the template instead
  console.log(req.cookies);
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id] // Pass the entire user object to your templates via templateVars
  };
  res.render('urls_index', templateVars); // Update the _header partial to show the email property from the user object instead of the username
});

// change all username variables in your code

app.post('/login', (req, res) => {
  res.cookie('user_id', req.body.username);
  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
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
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});

// app.get("/u/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL;
//   if (urlDatabase[shortURL]) {
//     let longURL = urlDatabase[shortURL].longURL;
//     if (longURL === undefined) {
//       res.status(302);
//       return;
//     }
//     const regex = /^http(s)?:\/\//;
//     longURL = longURL.match(regex) ? longURL : `http://${longURL}`
//     res.redirect(longURL);
//     return;
//   }
//   res.status(404).send("ShortURL does not exist");
// });

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