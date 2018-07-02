module.exports = (checkFor) => ({
  id: checkFor.string().regex(/^[a-zA-Z0-9_\-]{6,30}$/).required()
    .error(() => `'id' must be at least 6 characters long and must
  contain at least one lower case letter, one upper case letter, one number
  and one symbol character [_-]`),
});
