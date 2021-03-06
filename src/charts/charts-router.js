const express = require("express");
const ChartsService = require("./charts-service");
const { requireAuth } = require("../middleware/jwt-auth");
const EventService = require("../issue-events/issue-events-service");
const UsersService = require("../users/users-service");
var moment = require("moment");

const ChartsRouter = express.Router();

ChartsRouter.route("/monthly/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    let months = []
    for(let i = 3; i >= 0; i--){
     months.push(moment(moment().month() - i, "M").format("MMMM"));
    }
    let currentMonth = moment().month() + 1;
    months.push(moment(currentMonth, "M").format("MMMM"));
    ChartsService.getMonthlyData(req.app.get("db"), req.params.teamId)
      .then(chartData => {
        let data = {};
        data.labels = months;
        data.chartData = chartData;
        res.json(data);
      })
      .catch(next);
  });

ChartsRouter.route("/userdays/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    const { userId, teamId } = req.headers;
    let userDayList = [];
    UsersService.getUsersByTeamId(req.app.get("db"), teamId, userId)
      .then(res => {
        res
          .forEach(user => {
            ChartsService.getUserDays(req.app.get("db"), user.id).then(data => {
              console.log(data);
              userDayList.push(data);
            });
          })
          .then(res.send(userDayList));
      })
      .catch(next);
  });

ChartsRouter.route("/changepercentage/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    let current;
    let last;

    ChartsService.getTotalCurrentMonth(req.app.get("db"), req.params.teamId)
      .then(data => (current = data))
      .then(() =>
        ChartsService.getTotalLastMonth(
          req.app.get("db"),
          req.params.teamId
        ).then(data => (last = data))
      )
      .then(() => res.json(current - last))
      .catch(next);
  });

ChartsRouter.route("/changeresolved/:teamId")
  .all(requireAuth)
  .get((req, res, next) => {
    let current;
    let last;

    ChartsService.getResolvedCurrentMonth(req.app.get("db"), req.params.teamId)
      .then(data => (current = data))
      .then(() =>
        ChartsService.getResolvedLastMonth(
          req.app.get("db"),
          req.params.teamId
        ).then(data => (last = data))
      )
      .then(() => res.json(current - last))
      .catch(next);
  });

module.exports = ChartsRouter;
