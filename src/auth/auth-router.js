const express = require("express");
const AuthService = require("./auth-service");
const { requireAuth } = require("../middleware/jwt-auth");
const UserService = require('../users/users-service');
const TeamsService = require('../teams/teams-service');
const authRouter = express.Router();
const jsonBodyParser = express.json();



authRouter.post("/teamauth", requireAuth, jsonBodyParser, (req, res, next) => {
  const { password_input, team_id, user_id } = req.body;
  const user_data = { team_id, password_input, user_id };

  for (const [key, value] of Object.entries(user_data)) {
    if (value == null)
      return res.status(400).json({
        error: `${key} is not found in request body`
      });
  }

  TeamsService.getTeamWithId(req.app.get("db"), user_data.team_id)
    .then(dbTeam => {
      if (!dbTeam)
        return res.status(400).json({
          error: "No team found"
        });


  return AuthService.comparePasswords(
    user_data.password_input,
    dbTeam.team_password
  ).then(match => {
    if (!match) {
      return res.status(400).json({
        error: "Incorrect password"
      })
    } else 
      UserService.updateUserTeam(req.app.get("db"), user_data.team_id, dbTeam.team_name, user_data.user_id)
      .then(user => {
        console.log('user')
        console.log(user);
        const sub = user.user_name;
        const payload = {
          userId: user.id,
          teamId: user.team_id,
          teamName: user.team_name,
          user_name: user.user_name,
          full_name: user.full_name
        };
        res.send({
          authToken: AuthService.createJwt(sub, payload)
        });    
       }).catch(next)
})
    }).catch(next)
  });

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
  const payload = { userId: req.user.id , user_name: req.user.user_name, full_name: req.user.full_name, teamId : req.user.team_id, teamName: req.user.team_name };
  res.send({
    authToken: AuthService.createJwt(sub, payload)
  });
});

module.exports = authRouter;