const Product = require("../models/product");

exports.getProducts = (req, res, next ) => {
    Product.findAll().then(products => {
        res.json(products);
    }).catch(err => console.log(err));
}

exports.postAddProduct = async (req, res, next) => {
    try{
        const body = req.body;
        console.log(body);
        const product = Product.create({ albumId : body.albumId, title : body.title, imageUrl : body.imageUrl, price : body.price});
        res.status(200).json({created : true});
    }catch(err){
        console.log(err);
    }
}

exports.deleteProduct = (req, res, next ) => {
    try{

        const productId = req.params.productId;
        Product.findByPk(productId).then(product => {
            return product.destroy();
        }).then(result => {
            res.json(result);
        })

    }catch(err){
        res.json(err);
    }
}