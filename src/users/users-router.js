const express = require("express");
const UsersService = require("./users-service");

const UsersRouter = express.Router();
const jsonBodyParser = express.json();

UsersRouter.route("/").get((req, res, next) => {
  UsersService.getUsers(req.app.get("db"))
    .then(users => {
      res.json(users);
    })
    .catch(next);
});

UsersRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const { password, user_name, full_name, title } = req.body;

  //check all required fields
  for (const field of ["full_name", "user_name", "password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  // validate password
  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  //check if user name is taken
  UsersService.checkUserName(req.app.get("db"), user_name)
    .then(checkUserName => {
      if (checkUserName)
        return res.status(400).json({ error: `Username already taken` });

      //hash password and replace
      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          user_name,
          password: hashedPassword,
          full_name,
          title,
          date_created: "now()"
        };
        return UsersService.insertUser(req.app.get("db"), newUser).then(
          user => {
            res.status(201).json(UsersService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

UsersRouter.route("/setteam/:teamId").patch(
  jsonBodyParser,
  (req, res, next) => {
    UsersService.updateUserTeam(
      req.app.get("db"),
      req.params.teamId,
      req.headers.user_id
    )
      .then(res.status(201))
      .catch(next);
  }
);

UsersRouter.route("/getuser/:userId").get((req, res, next) => {
  const { user_id } = req.headers;
  UsersService.getUserByUserId(req.app.get("db"), user_id)
    .then(user => res.json(user))
    .catch(next);
});

module.exports = UsersRouter;
