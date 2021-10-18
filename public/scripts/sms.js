// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    from: '+6474961279',
    to: '+15558675310'
  })
  .then(message => console.log(message.sid))
  .catch(err => console.log(err));


  // Twilio 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const receiverNumber = process.env.TWILIO_RECEIVER_NUMBER;
const client = require('twilio')(accountSid, authToken);
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