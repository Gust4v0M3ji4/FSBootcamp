const router = require("express").Router();
const jwt = require("jsonwebtoken");
const basicAuthMiddleware = require("../../middlewares/basicAuth");
const Users = require("../../models/users");
const jwtSecret = process.env.JWT_SECRET || "thisismysecret";

// Basic Auth → JWT
router.get("/token", basicAuthMiddleware, (req, res) => {
  const userData = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
  };

  jwt.sign({ user: userData }, jwtSecret, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      return res
        .status(500)
        .json({ code: "ER", message: "Error generating token!" });
    }
    res.json({
      code: "OK",
      message: "Token generated successfully!",
      data: {
        token,
        user: userData,
        expiresIn: "2h",
      },
    });
  });
});

// JSON Login → JWT
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(401)
      .json({ code: "UA", message: "Email and password are required!" });
  }

  return Users.loginUser(email, password, (err, user) => {
    if (err) {
      return res.status(500).json({ code: "ER", message: "Error logging in!" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ code: "UA", message: "Email and password are invalid!" });
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    jwt.sign(
      { user: userData },
      jwtSecret,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .json({ code: "ER", message: "Error generating token!" });
        }
        res.json({
          code: "OK",
          message: "Login successfully!",
          data: {
            token,
            user: userData,
            expiresIn: "2h",
          },
        });
      }
    );
  });
});

// Session Login
router.post("/session/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(401)
      .json({ code: "UA", message: "Email and password are required!" });
  }

  return Users.loginUser(email, password, (err, user) => {
    if (err) {
      return res.status(500).json({ code: "ER", message: "Error logging in!" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ code: "UA", message: "Email and password are invalid!" });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.json({
      code: "OK",
      message: "Session login successful!",
      data: {
        user: req.session.user,
        sessionId: req.session.id,
      },
    });
  });
});

// Session Logout
router.post("/session/logout", (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ code: "UA", message: "No active session found!" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ code: "ER", message: "Error destroying session!" });
    }
    res.json({ code: "OK", message: "Session logout successful!" });
  });
});

// Check Session Status
router.get("/session/status", (req, res) => {
  if (req.session.user) {
    res.json({
      code: "OK",
      message: "Session is active!",
      data: {
        user: req.session.user,
        sessionId: req.session.id,
      },
    });
  } else {
    res.status(401).json({ code: "UA", message: "No active session!" });
  }
});

module.exports = router;
