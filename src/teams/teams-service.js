const bcrypt = require("bcryptjs");
const xss = require("xss");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const TeamsService = {
  getTeams(db) {
    return db.from("teams").select("*");
  },
  checkTeamName(db, team_name) {
    return db("teams")
      .where({ team_name })
      .first()
      .then(team => !!team);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 10);
  },
  insertTeam(db, newTeam) {
    return db
      .insert(newTeam)
      .into("teams")
      .returning("*")
      .then(([team]) => team);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain one upper case, lower case, number and special character";
    }
    return null;
  },
  getTeamNameById(db, teamId) {
    return db("teams")
      .where({ id: teamId })
      .first()
      .then(team => {
        return team.team_name;
      });
  },
  serializeTeam(team) {
    return {
      id: team.id,
      company: xss(team.company),
      team_name: xss(team.team_name),
      team_password: xss(team.team_password),
      administrator: xss(team.administrator),
      date_created: new Date(team.date_created)
    };
  }
};

module.exports = TeamsService;
