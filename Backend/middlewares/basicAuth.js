const Users = require("../models/users");
const bcrypt = require("bcrypt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ code: "UA", message: "Authorization header is required!" });
  }

  const [type, credentials] = authHeader.split(" ");
  if (type !== "Basic") {
    return res
      .status(401)
      .json({ code: "UA", message: "Authorization type is not supported!" });
  }
  console.log("credentials Base 64:", credentials);

  if (!credentials) {
    return res
      .status(401)
      .json({ code: "UA", message: "Credentials are required!" });
  }

  const rawCredentials = Buffer.from(credentials, "base64").toString("utf-8");

  console.log("credentials utf-8:", rawCredentials);

  const [email, password] = rawCredentials.split(":");
  console.log("email:", email);
  console.log("password:", password);
  if (!email || !password) {
    return res
      .status(401)
      .json({ code: "UA", message: "Email and password are required!" });
  }

  return Users.getUserByEmail(email, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({
          code: "ER",
          message: "Error getting user by username and password!",
        });
    }
    if (!user) {
      return res
        .status(401)
        .json({ code: "UA", message: "Email and password are invalid!" });
    }

    // Comparar password con hash usando bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ code: "ER", message: "Error verifying password!" });
      }
      if (!isMatch) {
        return res
          .status(401)
          .json({ code: "UA", message: "Email and password are invalid!" });
      }
      req.user = user;
      next();
    });
  });
};
