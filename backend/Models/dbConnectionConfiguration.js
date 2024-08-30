const mysql = require("mysql2/promise");
require('dotenv').config();

class Database {
  constructor() {
    if (Database.exists) {
      return Database.instance;
    }
    this.initDB();
    Database.instance = this;
    Database.exists = true;
    return this;
  }

  initDB() {
    this.poolNurses = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_NURSES_USERNAME,
      password: process.env.DB_NURSES_PASSWORD,
      database: process.env.MYSQL_DB,
      connectionLimit: process.env.CONNECTION_LIMIT,
    });

    this.poolDoctors = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_DOCTORS_USERNAME,
      password: process.env.DB_DOCTORS_PASSWORD,
      database: process.env.MYSQL_DB,
      connectionLimit: process.env.CONNECTION_LIMIT,
    });

    this.poolFrontDesk = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_FRONTDESK_USERNAME,
      password: process.env.DB_FRONTDESK_PASSWORD,
      database: process.env.MYSQL_DB,
      connectionLimit: process.env.CONNECTION_LIMIT,
    });
    this.poolHR = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_HR_USERNAME,
      password: process.env.DB_HR_PASSWORD,
      database: process.env.MYSQL_DB,
      connectionLimit: process.env.CONNECTION_LIMIT,
    });

    this.poolBusinessOfficers = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_BUSINESSOFFICER_USERNAME,
      password: process.env.DB_BUSINESSOFFICER_PASSWORD,
      database: process.env.MYSQL_DB,
      connectionLimit: process.env.CONNECTION_LIMIT,
    });
  }
}

module.exports = new Database();
// dbConnectionConfiguration.js
export const poolDoctors = poolDoctors;
export const poolNurses = poolNurses;
export const poolFrontDesk = poolFrontDesk;
export const poolBusinessOfficers = poolBusinessOfficers;
export const poolHR = poolHR;
