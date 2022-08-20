const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes")
const sequelize = require("./utils/database");
const errorController = require("./controllers/error");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(productRoutes);
app.use(errorController.get404);

sequelize.sync().then(() => {
    app.listen(4000);
}).catch(err => console.log(err));


