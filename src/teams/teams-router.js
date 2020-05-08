const express = require("express");
const TeamsService = require("./teams-service");
const UsersService = require("../users/users-service");
const { requireAuth } = require("../middleware/jwt-auth");
const TeamsRouter = express.Router();
const jsonBodyParser = express.json();

/*


fix team password show, select only team name



*/
TeamsRouter.route("/").get((req, res, next) => {
  TeamsService.getTeams(req.app.get("db"))
    .then(teams => {
      res.json(teams);
    })
    .catch(next);
});

TeamsRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const { company, team_name, team_password, team_admin } = req.body;
  const { userId } = req.headers;

  //check all required fields
  for (const field of ["team_name", "company", "team_password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  // validate password
  const passwordError = TeamsService.validatePassword(team_password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  //check if user name is taken
  TeamsService.checkTeamName(req.app.get("db"), team_name)
    .then(checkTeamName => {
      if (checkTeamName)
        return res.status(400).json({ error: `Team name already taken` });

      //hash password and replace
      return TeamsService.hashPassword(team_password).then(hashedPassword => {
        const newUser = {
          company,
          team_name,
          team_password: hashedPassword,
          team_admin: team_admin ? userId : null,
          creator_id: userId ? userId : null, //*****change to just userid! */
          date_created: "now()"
        };
        return TeamsService.insertTeam(req.app.get("db"), newUser).then(
          team => {
            res.status(201).json(TeamsService.serializeTeam(team));
          }
        );
      });
    })
    .catch(next);
});

TeamsRouter.route("/:teamId/users").get(requireAuth, (req, res, next) => {
  const { teamId, userId } = req.user;
  UsersService.getUsersByTeamId(req.app.get("db"), teamId, userId)
    .then(users => res.json(users))
    .catch(next);
});

TeamsRouter.route("/teamname").get(requireAuth, (req, res, next) => {
  const { teamid } = req.headers;
  TeamsService.getTeamNameById(req.app.get("db"), teamid)
    .then(team => {
      if (!team) {
        res.status(404).json({ error: `Team name not found` });
      }
      res.json(team);
    })
    .catch(next);
});

module.exports = TeamsRouter;
