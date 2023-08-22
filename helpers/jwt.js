const jwt = require("jsonwebtoken");
const secretCode = process.env.SECRET_CODE;

const tokenGenerator = (user) => {
  const { id, name, email, password, gender, type } = user;
  let token = jwt.sign(
    {
      id,
      name,
      email,
      password,
      gender,
      type,
    },
    secretCode
  );
  return token;
};

const tokenVerifier = (token) => {
  let decoded = jwt.verify(token, secretCode);
  return decoded;
};

module.exports = {
  tokenGenerator,
  tokenVerifier,
};
