
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'AlphaBetaDeltaGamma',
    from: '+6474961279', // our number
    to: '+6476462240'
  })
  .then(message => console.log(message.sid));