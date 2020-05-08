const express = require("express");
const IssuesService = require("./issues-service");
const { requireAuth } = require("../middleware/jwt-auth");
const EventService = require("../issue-events/issue-events-service");

const IssuesRouter = express.Router();
const jsonBodyParser = express.json();

IssuesRouter.route("/team/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    IssuesService.getIssuesByTeamId(req.app.get("db"), req.params.teamId)
      .then(issues => {
        res.json(issues);
      })
      .catch(next);
  })

  .post(jsonBodyParser, (req, res, next) => {
    const {
      team_id,
      category,
      summary,
      description,
      assignee,
      severity,
      priority,
      resolution,
      creator_id,
      creator_user_name
    } = req.body;

    const newIssue = {
      team_id,
      category,
      summary,
      description,
      assignee,
      severity,
      priority,
      resolution,
      creator_id,
      creator_user_name
    };
    newIssue;
    for (const [key, value] of Object.entries(newIssue)) {
      if (value == null && key !== "assignee") {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    IssuesService.addIssue(req.app.get("db"), newIssue).then(issue => {
      EventService.addNewEvent(req.app.get("db"), issue).then(issue => {
        res.status(201).json(issue);
      });
    });
  });

//get active issues
IssuesRouter.route("/active/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    IssuesService.getActiveIssues(req.app.get("db"), req.params.teamId)
      .then(issues => {
        res.json(issues);
      })
      .catch(next);
  });

//get resolved issues
IssuesRouter.route("/resolved/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    IssuesService.getResolvedIssues(req.app.get("db"), req.params.teamId)
      .then(issues => {
        res.json(issues);
      })
      .catch(next);
  });

//get recently modified
IssuesRouter.route("/recently-modified/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    IssuesService.getRecentlyModifiedIssues(
      req.app.get("db"),
      req.params.teamId
    )
      .then(issues => {
        res.json(issues);
      })
      .catch(next);
  });

IssuesRouter.route("/issue/:issueId")
  .all(requireAuth, (req, res, next) => {
    IssuesService.getIssueByIssueId(req.app.get("db"), req.params.issueId)
      .then(issue => {
        if (!issue) {
          return res.status(404).json({
            error: { message: `Issue doesn't exist` }
          });
        }
        res.issue = issue;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.issue);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const {
      team_id,
      category,
      summary,
      description,
      assignee,
      severity,
      priority,
      resolution,
      creator_id
    } = req.body;
    const updatedIssue = {
      team_id,
      category,
      summary,
      description,
      assignee,
      severity,
      priority,
      resolution,
      creator_id
    };

    for (const [key, value] of Object.entries(updatedIssue)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    AdminService.updateIssue(
      req.app.get("db"),
      req.params.issueId,
      updatedIssue
    ).then(issue => {
      res.status(201);
    });
  });

module.exports = IssuesRouter;
