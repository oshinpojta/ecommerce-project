const Cart = require("../models/cart");
const Product = require("../models/product");
const CartItem = require("../models/cart-item");
const Order = require("../models/order");
const OrderItem = require("../models/order-item");

exports.getOrders = async (req, res, next) => {
    try{
        let orders = await Order.findAll({where : {userId : req.user.id}});
        res.json({ data : orders, success : true });
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}


exports.getOrdersByOrderId = async (req, res, next) => {
    try{
        let orderId = req.params.orderId;
        let orders = await OrderItem.findAll({ where : { orderId : orderId}});
        return res.json({ data : orders, success : true});
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}


exports.addOrder = async (req, res, next) => {
    try{
        let results = [];
        let order = await req.user.createOrder();
        let cart = await req.user.getCart();
        let products = await cart.getProducts();
        for(let i=0;i<products.length;i++){
            console.log(products[i]);
            let result = await order.addProduct(products[i],{ 
                through : {
                    quantity : products[i].cartItem.quantity
                }
            });
            results.push(result);
        }
        res.json({ orderId : order.id, success : true});
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}


exports.deleteOrder = async (req, res, next) => {
    try{
        let orderId = req.params.orderId;
        Order.destroy({where : {id : orderId}});
        res.json({success : true})
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
};