module.exports = (ACTIONS) => {

  ACTIONS.on('users.auth', (payload) => {

    payload.name = 'Vasya';

    return Promise.resolve(payload);

  });

  ACTIONS.on('clear.users.auth', () => {

    // Some magic for clean unstoppable functions (for ex. listen port)

  });

};
