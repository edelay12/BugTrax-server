const knex = require("knex");
var moment = require("moment");

const ChartsService = {
  getMonthlyData(db, teamId) {
    let monthlyData = [];
    return (
      db
        .from("issues")
        .count("date_created as count")
        .where({ team_id: teamId })
        // .groupByRaw("date_trunc('month', date_created::date)")

        .groupByRaw("EXTRACT(MONTH FROM date_created::date)")

        .as("month")
        //  .andWhereRaw(`EXTRACT(MONTH FROM date_created::date) = ?`, [1])
        .then(rows => {
          console.log("Monthly data");
          console.log(rows);
          rows;
        })
        .catch(e => {
          console.log(e);
        })
    );
  },
  getUserDays(db, user_id) {
    return db
      .from("users")
      .where({ id: Number(user_id) })
      .first()
      .then(user => {
        let start = moment(user.date_created, "YYYY-MM-DD");
        let end = moment().startOf("day");

        return moment.duration(end.diff(start)).asDays();
      })
      .then(days => Math.round(days));
  },
  getTotalCurrentMonth(db, teamId) {
    let currentMonth = moment().month() + 1;

    return db
      .from("issues")
      .select("*")
      .where({ team_id: teamId })
      .andWhereRaw(`EXTRACT(MONTH FROM date_created::date) = ?`, [currentMonth])
      .then(res => res.length);
  },

  getResolvedLastMonth(db, teamId) {
    let lastMonth = moment().month();
    return db
      .from("issues")
      .select("*")
      .where({ team_id: teamId })
      .andWhereRaw(`EXTRACT(MONTH FROM date_created::date) = ?`, [lastMonth])
      .then(res => res.length);
  },

  getResolvedCurrentMonth(db, teamId) {
    let currentMonth = moment().month() + 1;

    return db
      .from("issues")
      .select("*")
      .where({ team_id: teamId })
      .andWhere({ resolution: "resolved" })
      .andWhereRaw(`EXTRACT(MONTH FROM date_created::date) = ?`, [currentMonth])
      .then(res => res.length);
  },

  getTotalLastMonth(db, teamId) {
    let lastMonth = moment().month();
    return db
      .from("issues")
      .select("*")
      .where({ team_id: teamId })
      .andWhere({ resolution: "resolved" })
      .andWhereRaw(`EXTRACT(MONTH FROM date_created::date) = ?`, [lastMonth])
      .then(res => res.length);
  }
};

module.exports = ChartsService;
