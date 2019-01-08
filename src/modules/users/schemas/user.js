module.exports = {
  schema: {
    firstName: {
      type: 'string',
      default: '',
      validate: {
        string: true,
        alphanum: true,
        min: 4, max: 30,
        regex: /^[a-zA-Z0-9_\-]{6,30}$/g,
      },
    },
    age: {
      type: 'number',
      default: 0,
      validate: {
        number: true,
        min: 4, max: 30,
      },
    },
  },
  statics: {
    addFollower: ({ id }) => {},
  },
  relationships: () => {

  },
};
