/* eslint-disable camelcase */


// load .env data into process.env
require("dotenv").config();
const cookieSession = require('cookie-session');
const $ = require('jquery');

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

//Bcrypt and Salt
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const salt = bcrypt.genSaltSync(10);

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const receiverNumber = process.env.TWILIO_RECEIVER_NUMBER;
const client = require('twilio')(accountSid, authToken);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["user_id"],

    maxAge: 60 * 60 * 1000
  })
);

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

//

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) =>{
  res.redirect("login");
});

//login page -> if user is already logged in, will be redirected to main page.
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/restaurants");
    return;
  }
  res.render("login.ejs");
});

//login page -> if user is exists, then compares information with current db and redirects to main page else error.
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    `
  SELECT *
  FROM users
  WHERE email = $1;`, [email]).then((result) => {
    if (result.rows[0]) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user_id = user.id;
        res.redirect("/restaurants");
      }
    } else {
      res.status(403).send("Email cannot be found or wrong password / email");
    }
  })
    .catch((err) => {
      console.log(err.message);
    });
});

//register page
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/restaurants");
    return;
  }
  res.render("register.ejs");
});

app.post("/register", (req, res)=> {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone_number = req.body.phone;
  console.log(req.body);
  db.query(

  );
  db.query(
    `
    INSERT INTO users (name, email, password, phone_number)
    VALUES ($1, $2, $3, $4)
    RETURNING *`, [name, email, password, phone_number]).then((result) => {
    const user = result.rows[0];
    console.log(result);
    console.log(user);
    req.session.user_id = user.id;
    res.redirect("/restaurants");

  })
    .catch((err) => {
      console.log(err.message);
    });
});

//restaurants page
app.get("/restaurants", (req, res) =>{
  res.render("restaurants");
});

//menu page
app.get("/menu", (req, res)=> {
  res.render("menu");
});


app.post("/menu", (req, res) => {




});

// --------------------------------//
        // Twilio Section //
// --------------------------------//

// Twillio SMS trigger
app.get('/twilio', (req, res) => {
  // call Twilio Send func
  
  setTimeout(() => {
    orderProcessedText();
    orderPlacedText();
  }, 5000);

  setTimeout(() => {
    orderReadyText();
  }, 10000);



  res.send(
    `
    <div style="text-align:center; padding-top:25%;">
    <h1> Twilio Send Test </h1>
    <p> ipsum lorem </p>
    </div>
    `
  );
});


// Outgoing msg to CUSTOMER that order has been processed!
const orderProcessedText = () => {
  client.messages
    .create({
      body: `
        Hello, Bob! You're order for *FROM CHECKOUT* has been placed with *RESTAURANT NAME* for order no.*ORDER NUM FROM DB*. Your estimated delivery time is *SOME NUM*. You will receive a notification once your order is ready for pickup. Send 'ETA' for an update on the remaining time for your order!
      `,
      from: '+16474961279', // account num
      // from: '+15005550006', // magic num
      // to: '+12264000462'// sms receiver burner
      to: receiverNumber// real number
    })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err));
};

const orderPlacedText = () => {
// Outgoing msg to RESTAURANT that order has been placed!
  client.messages
    .create({
      body: `
        Hello, *RESTAURANT NAME*! An order has just been placed by *CUSTOMER NAME, TELEPHONE NUMBER, ORDER #* for: *LIST OF ITEMS IN ORDER*. 
      `,
      from: '+16474961279', // account num
      // from: '+15005550006', // magic num
      // to: '+12264000462'// sms receiver burner
      to: receiverNumber// real number
    })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err));
};
const orderReadyText = () => {
// Outgoing msg to customer that order is ready for pickup!
  client.messages
    .create({
      body: `
        Hello, Bob! Your order is now ready for pickup! Please present *ORDER NUM* to receive your items! Enjoy your meal and thank you for useing *APP NAME*! 
      `,
      from: '+16474961279', // account num
      // from: '+15005550006', // magic num
      // to: '+12264000462'// sms receiver burner
      to: receiverNumber// real number
    })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err));
};


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
