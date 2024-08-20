const mysql = require("mysql2/promise");
require('dotenv').configf();

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

    this.poolSeller = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER_SELLER,
      password: process.env.DB_PASS_SELLER,
      database: process.env.MYSQL_DB,
      connectionLimit: process.env.CONNECTION_LIMIT,
    });
  }
}