module.exports = (ACTIONS) => {

	ACTIONS.on('users_auth', (payload) => {

		return Promise.resolve({ payload });

	});

};
