const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.PASSWORD, {
    host : process.env.DB_HOST ,
    dialect : "mysql"
});

module.exports = sequelize;