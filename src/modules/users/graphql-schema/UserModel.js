const users = [
  {
    name: 'Vasya',
    surname: 'Pupkin',
  },
];

module.exports = (ACTIONS) => ({
  add: (data) => new Promise((res, rej) => {
    // ACTIONS.send('database.create');
    users.push(data);
    res('OK');
  }),
  getAll: () => new Promise((res, rej) => {
    // ACTIONS.send('database.getAll');
    res(users);
  }),
  getUserByPosition: (position) => new Promise((res, rej) => {
    // ACTIONS.send('database.getOne');
    res(users[position]);
  }),
});
