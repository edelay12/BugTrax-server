const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Issues Endpoints", function() {
  let db;

  const { testIssues } = helpers.makeEstoreFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/issues`, () => {
    context("Given there are issues in the database", () => {
      beforeEach("insert issues", () =>
        helpers.seedProductsTable(db, testIssues)
      );

      it("responds with 200 and all of the issues", () => {
        const expectedIssues = testIssues;

        return supertest(app)
          .get("/api/issues")
          .expect(200, expectedIssues);
      });
    });
  });
});
