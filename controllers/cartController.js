const Cart = require("../models/cart");
const Product = require("../models/product");
const CartItem = require("../models/cart-item");

exports.getCart = (req, res, next) => {
    Cart.findAll().then(carts => {
        return carts[0].getProducts().catch(err => console.log(err));
    }).then(products => {
        res.json(products);
    })
    .catch(err => console.log(err));
}

exports.addToCart = (req, res, next) => {
    const prodId = req.params.productId;
    // const prodCount = req.params.count;
    const prodCount = 1;
    let fetchedCart ;
    let newQuantity = 1;
    req.user.getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts({where : { id : prodId }});
    }).then(products => {
        let product;
        if(products.length > 0){
            product = products[0];
        }

        if(product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity+prodCount;
            return product;
        }
        return Product.findByPk(prodId);
    }).then(product => {
        console.log(product);
        return fetchedCart.addProduct(product, {
            through: {quantity : newQuantity}
        });
    }).then((result)=>{
        console.log("result",result[0]);
        res.status(200).json({added : true});
    }).catch(err => console.log(err));
} 

exports.deleteProductInCart = (req, res, next) => {
    const prodId = req.params.productId;
    CartItem.destroy({where : {productId : prodId}}).then(result => {
        console.log("result",result);
        res.status(200).json({deleted : true});
    }).catch(err => console.log(err));
}