const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Teams Endpoints", function() {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DATABASE_URL
  });
  app.set("db", db);
});
after("disconnect from db", () => db.destroy());

before("cleanup", () => helpers.cleanTables(db));

afterEach("cleanup", () => helpers.cleanTables(db));

describe(`POST /api/teams`, () => {
  context(`Team Validation`, () => {
    beforeEach("insert teams", () => helpers.seedTeams(db, testTeams));

    const requiredFields = ["password", "team_id"];

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        team_id: 1,
        password: "testPassword"
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field];

        return supertest(app)
          .post("/api/teams")
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });

      it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          team_id: 1,
          password: "1234567"
        };
        return supertest(app)
          .post("/api/teams")
          .send(userShortPassword)
          .expect(400, { error: `Password be longer than 8 characters` });
      });

      it(`responds 400 'Password be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          team_id: 1,
          password: "*".repeat(73)
        };
        return supertest(app)
          .post("/api/teams")
          .send(userLongPassword)
          .expect(400, { error: `Password be less than 72 characters` });
      });
    });
  });
});
