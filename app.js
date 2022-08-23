const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./utils/database");

const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

Product.belongsTo(User, {contraints : true, onDelete : "CASCADE"});
User.hasOne(Cart);
User.hasMany(Product);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through : CartItem});
Product.belongsToMany(Cart, {through : CartItem});
Order.belongsTo(User, {contraints : true, onDelete : "CASCADE"});
User.hasMany(Order);
Order.belongsToMany(Product, {through : OrderItem});
Product.belongsToMany(Order, {through : OrderItem});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, `views`)));

app.use((req, res, next) =>{
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use("/products",productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders",orderRoutes);
app.use((req, res)=>{
    try{
        let url = req.url.split("/");
        //console.log(path.join(__dirname, `views/${url[url.length-1]}`));
        res.sendFile(path.join(__dirname, `views/${url[url.length-1]}`));
    }catch(err){
        res.redirect("/index.html")
    }
})
app.use(errorController.get404);


sequelize.sync().then(()=>{
    return User.findByPk(1);
}).then(user => {
    if(!user){
        return User.create({name : "Oshin", email : "sujanian785@gmail.com", password : "12345678"});
    }
    return user;
}).then( user => {
    return user.createCart();
})
.then(() => {
    app.listen(4000);
}).catch(err => console.log(err));


