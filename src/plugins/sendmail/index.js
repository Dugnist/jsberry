const sendmail = require('sendmail')({ silent: true });
const { credentials } = require('./config.json');
const { emailTo, emailFrom } = credentials;

module.exports = ({ ACTIONS }) => {
  /**
   * Send message
   * how to use:
   *  ACTIONS.send('sendmail.send', { body: 'some message text' })
   *    .then(success => console.log(success))
   *    .catch((warning) => console.error(warning));
   */
  ACTIONS.on('sendmail.send', ({
    from = emailFrom,
    to = emailTo,
    subject = 'title',
    body = 'don\'t forget the message!',
  }) =>
    new Promise((resolve, reject) => {
      sendmail({
        from,
        to,
        subject,
        html: body,
      }, (err, reply) => {
        return (!err) ? resolve(reply) : reject(err);
      });
    })
  );
};
