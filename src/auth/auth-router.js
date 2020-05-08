const express = require("express");
const AuthService = require("./auth-service");
const { requireAuth } = require("../middleware/jwt-auth");

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post("/login", jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const userLogin = { user_name, password };

  for (const [key, value] of Object.entries(userLogin)) {
    if (value == null)
      return res.status(400).json({
        error: `${key} is not found in request body`
      });
  }

  AuthService.getUserWithUserName(req.app.get("db"), userLogin.user_name)
    .then(dbUser => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect username or password"
        });

      return AuthService.comparePasswords(
        userLogin.password,
        dbUser.password
      ).then(match => {
        if (!match)
          return res.status(400).json({
            error: "Incorrect username or password"
          });

        const sub = dbUser.user_name;
        const payload = {
          userId: dbUser.id,
          teamId: dbUser.team_id,
          teamName: dbUser.team_name,
          user_name: dbUser.user_name,
          full_name: dbUser.full_name
        };
        res.send({
          authToken: AuthService.createJwt(sub, payload)
        });
      });
    })
    .catch(next);
});

authRouter.post("/refresh", requireAuth, (req, res) => {
  const sub = req.user.user_name;
  const payload = { userId: req.user.id };
  res.send({
    authToken: AuthService.createJwt(sub, payload)
  });
});

module.exports = authRouter;
