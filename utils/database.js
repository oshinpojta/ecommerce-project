const Sequelize = require("sequelize");

const sequelize = new Sequelize("ecommerce", "root", "darkknight2785", {
    host : "localhost",
    dialect : "mysql" 
});

module.exports = sequelize;