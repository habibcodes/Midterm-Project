// load .env data into process.env
require("dotenv").config();
const cookieSession = require('cookie-session');
const $ = require('jquery');

// Web server config
const PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
const morgan = require("morgan");

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


app.use(express.static("public"));


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
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

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) =>{
  res.redirect("login")
})
//login page
app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", (req, res) => {
  res.redirect("restaurants")
})

//register page
app.get("/register", (req, res) => {
  res.render("register")
})

app.post("/register", (req, res)=> {

  res.redirect("/restaurants");
});

//restaurants page
app.get("/restaurants", (req, res) =>{
  res.render("restaurants")
})

//menu page



app.get("/menu", (req, res)=> {
  db
  .query('SELECT * FROM food_items ORDER BY price DESC')
  .then((result) => {
    const items = result.rows
    res.render("menu", {items})
  })
  .catch((err)=>{
      res.send(err.message)


  })

})


app.post("/menu", (req, res) => {


})

// --------------------------------//
// Twilio Section //
app.get('/twilio', (req, res) => {
  // call Twilio Send func
  sendText();

  res.send(
    `
    <div style="text-align:center; padding-top:25%;">
    <h1> Twilio Send Test </h1>
    <p> ipsum lorem </p>
    </div>
    `
  );
});


const sendText = () => {
//
  client.messages
    .create({
      body: 'This is an outgoing twilio sms test.',
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
