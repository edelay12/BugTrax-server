const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      full_name: "test test",
      user_name: "testuser1",
      password: "password1"
    },
    {
      full_name: "test test",
      user_name: "testuser2",
      password: "password2"
    },
    {
      full_name: "test test",
      user_name: "testuser3",
      password: "password3"
    },
    {
      full_name: "test test",
      user_name: "testuser3",
      password: "password3"
    }
  ];
}

function makeIssuesArray() {
  return [
    {
      team_id: 2,
      category: "Bug",
      summary: "Summry of test issue",
      description: 'description of test issue',
      severity: "minor",
      priority: "low",
      resolution: "new",
      creator_id: 2,
      creator_user_name: "jApple"
    },
    {
      team_id: 2,
      category: "Bug",
      summary: "Summry of test issue",
      description: 'description of test issue',
      severity: "minor",
      priority: "low",
      resolution: "new",
      creator_id: 2,
      creator_user_name: "jApple"
    },
    {
      team_id: 2,
      category: "Bug",
      summary: "Summry of test issue",
      description: 'description of test issue',
      severity: "minor",
      priority: "low",
      resolution: "new",
      creator_id: 2,
      creator_user_name: "jApple"
    },
    {
      team_id: 2,
      category: "Bug",
      summary: "Summry of test issue",
      description: 'description of test issue',
      severity: "minor",
      priority: "low",
      resolution: "new",
      creator_id: 2,
      creator_user_name: "jApple"
    },
    {
      team_id: 2,
      category: "Bug",
      summary: "Summry of test issue",
      description: 'description of test issue',
      severity: "minor",
      priority: "low",
      resolution: "new",
      creator_id: 2,
      creator_user_name: "jApple"
    },
    {
      team_id: 2,
      category: "Bug",
      summary: "Summry of test issue",
      description: 'description of test issue',
      severity: "minor",
      priority: "low",
      resolution: "new",
      creator_id: 2,
      creator_user_name: "jApple"
    }
  ];
}
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
         products
        `
    )
  );
}

function seedIssuesTable(db, issues) {
  return db.into("issues").insert(issues);
  /* .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('blogful_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    ) */
}

function makeBugtraxFixtures() {
  const testUsers = makeUsersArray();
  const testIssues = makeIssuesArray();
  return { testUsers, testIssues };
}

module.exports = {
  makeUsersArray,
  makeIssuesArray,
  makeBugtraxFixtures,
  cleanTables,
  seedIssuesTable
};
