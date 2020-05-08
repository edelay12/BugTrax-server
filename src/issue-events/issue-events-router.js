const express = require("express");
const EventsService = require("./issue-events-service");
const IssuesService = require("../issues/issues-service");
const { requireAuth } = require("../middleware/jwt-auth");

const EventsRouter = express.Router();
const jsonBodyParser = express.json();

EventsRouter.route("/team/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    EventsService.getEventsByTeamId(req.app.get("db"), req.params.teamId)
      .then(events => {
        res.json(events);
      })
      .catch(next);
  });

EventsRouter.route("/issue/:issueId")
  .all(requireAuth)
  .get((req, res, next) => {
    EventsService.getEventsByIssueId(req.app.get("db"), req.params.issueId)
      .then(events => {
        res.json(events);
      })
      .catch(next);
  });

EventsRouter.route("/newevent").post(jsonBodyParser, (req, res, next) => {
  const {
    change_summary,
    change_description,
    status,
    user_id,
    user_name,
    issue_id,
    team_id
  } = req.body;

  const newEvent = {
    change_summary,
    change_description,
    status,
    user_id,
    user_name,
    issue_id,
    team_id
  };
  for (const [key, value] of Object.entries(newEvent)) {
    if (value == null && key !== "description") {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      });
    }
  }
  EventsService.addUpdateEvent(req.app.get("db"), newEvent).then(event => {
    IssuesService.updateIssue(
      req.app.get("db"),
      newEvent.issue_id,
      newEvent.status
    )
      .then(event => {
        res.status(201).json(event);
      })
      .catch(next);
  });
});

async function checkIssueExists(req, res, next) {
  try {
    const product = await productService.getById(
      req.app.get("db"),
      req.params.itemId
    );

    if (!product)
      return res.status(404).json({
        error: `Product doesn't exist`
      });

    res.product = product;
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = EventsRouter;
