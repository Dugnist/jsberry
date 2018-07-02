module.exports = (checkFor) => ({
  login: checkFor.string().alphanum().min(4).max(30).required(),
  password: checkFor.string().regex(/^[a-zA-Z0-9_\-]{6,30}$/g).required()
    .error(() => `'password' must be at least 6 characters long and must
    contain at least one lower case letter, one upper case letter, one number
    and one symbol character [_-]`),
  email: checkFor.string().email().min(6).max(30).required(),
});
