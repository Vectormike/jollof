const pg = require('pg');

const url =
  'postgres://cochltcv:w90CheA-A1dPIMNYqtqZ56b0xUEi3Df4@salt.db.elephantsql.com:5432/cochltcv';
const db = new pg.Client(url);
db.connect(async () => {
  await db.query('SELECT * from users');

});
module.exports = db;
