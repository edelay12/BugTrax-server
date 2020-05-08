const bcrypt = require("bcryptjs");
const xss = require("xss");

const IssuesService = {
  getIssuesByTeamId(db, teamId) {
    return db
      .from("issues")
      .select("*")
      .where({ team_id: teamId });
  },
  getIssueByIssueId(db, issueId) {
    return db
      .from("issues")
      .select("*")
      .where({ id: issueId })
      .first();
  },
  addIssue(db, issue) {
    return db
      .insert(issue)
      .into("issues")
      .returning("*")
      .then(issues => {
        return issues[0];
      });
  },
  updateIssue(db, id, resolution) {
    return db("issues")
      .where("id", id)
      .update({ date_updated: "now()", resolution: resolution });
  },
  updateResolvedIssue(db, issueId, userId) {
    console.log("issueId " + issueId);
    console.log("userId " + userId);
    return db("issues")
      .where("id", issueId)
      .update({ resolved_by: userId });
  },

  getActiveIssues(db, teamId) {
    return db
      .from("issues")
      .select("*")
      .where({ team_id: teamId })
      .whereNot("resolution", "resolved");
  },

  getResolvedIssues(db, teamId) {
    return db
      .from("issues")
      .select("*")
      .where({ team_id: teamId })
      .where("resolution", "resolved");
  },

  getRecentlyModifiedIssues(db, teamId) {
    return db
      .from("issues")
      .select("*")
      .where({ team_id: teamId });
  },

  serializeIssue(team) {
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

module.exports = IssuesService;
