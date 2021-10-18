
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
<<<<<<< HEAD
    // checkout items go here
    body: 'AlphaBetaDeltaGamma',
    from: '+6474961279', // our twilio number
    to: '+XXXXXXXX'
=======
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    from: '+6474961279',
    to: '+15558675310'
>>>>>>> origin/master
  })
  .then(message => console.log(message.sid))
  .catch(err => console.log(err));