const { credentials } = require('./config.json');
const twilio = require('twilio');

const { number_to, number_from, account_sid, auth_token } = credentials;
const client = twilio(account_sid, auth_token);

module.exports = ({ ACTIONS }) => {

  ACTIONS.on('twillio.send', ({
    from = number_from,
    to = number_to,
    body = 'don\'t forget the message!',
  }) => {

    return new Promise((res, rej) => {

      // convert callback to return promise values
      const response = (e, s) => !e ? res({ success: s }) : rej({ error: e });

      client.messages.create({ to, from, body }, response);

    });

  });

}