const bcrypt = require("bcrypt");
const saltRound = +process.env.SALT_ROUND;

const encrypter = (pwd) => {
  return bcrypt.hashSync(pwd, saltRound);
};

const decrypter = (pwd, hashPwd) => {
  return bcrypt.compareSync(pwd, hashPwd);
};

module.exports = {
  encrypter,
  decrypter,
};
