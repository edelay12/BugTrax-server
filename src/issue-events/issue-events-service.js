const bcrypt = require("bcryptjs");
const xss = require("xss");
const IssuesService = require("../issues/issues-service");

const EventsService = {
  getEventsByTeamId(db, teamId) {
    return db
      .from("issue_events")
      .select("*")
      .where({ team_id: teamId });
  },
  addNewEvent(db, issue) {
    const event = {
      user_id: issue.creator_id,
      user_name: issue.creator_user_name,
      team_id: issue.team_id,
      issue_id: issue.id,
      change: `${issue.creator_user_name} added new issue (${issue.id})`,
      status: issue.resolution,
      change_summary: issue.summary,
      change_description: issue.description
    };
    return db.insert(event).into("issue_events");
  },
  getEventsByIssueId(db, issueId) {
    return db
      .select("*")
      .from("issue_events")
      .where({ issue_id: issueId });
  },
  addUpdateEvent(db, event) {
    switch (event.status) {
      case "resolved":
        event.change = `${event.user_name} resolved issue (${event.issue_id})`;
        IssuesService.updateResolvedIssue(db, event.issue_id, event.user_id);
        break;

      case "acknowlagedment":
        event.change = `${event.user_name} acknowledged issue (${event.issue_id})`;
        break;

      case "in-progress":
        event.change = `${event.user_name} changed issue (${event.issue_id}) to in-progress`;
        break;

      case "feedback":
        event.change = `${event.user_name} gave feedback on issue (${event.issue_id})`;
        break;
    }
    return db.insert(event).into("issue_events");
  }
};

module.exports = EventsService;
