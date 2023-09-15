const dotenv = require('dotenv');
dotenv.config();

const config = {
  dev: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: "+09:00", // DB에 저장할 때 시간 설정
    dialectOptions: {
      timezone: "+09:00" // DB에서 가져올 때 시간 설정
    }
  },
  prod: {
    
  },
};

module.exports = config;
