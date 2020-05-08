require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const TeamsRouter = require("./teams/teams-router");
const UsersRouter = require("./users/users-router");
const IssuesRouter = require("./issues/issues-router");
const EventsRouter = require("./issue-events/issue-events-router");
const AuthRouter = require("./auth/auth-router");
const ChatRouter = require("./chat/chat-router");
const ChartRouter = require("./charts/charts-router");
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/teams", TeamsRouter);
app.use("/api/users", UsersRouter);
app.use("/api/issues", IssuesRouter);
app.use("/api/events", EventsRouter);
app.use("/api/chat", ChatRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/charts", ChartRouter);

app.get("/", (req, res) => {
  res.send("Bugtrax!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
