import Product from "../models/product.js";


export function createProduct(req,res){
    if (!req.user){
        res.status(403).json({
            message:"you need to login first "
        })
        return;
    }



    // if (req.data.user.role!='admin'){
    //     res.status(403).json({
    //         message:"you are not allowed to add product"
    //     })
    //     return;
    // }

    const product=new Product(req.body);

    product.save().then(
        ()=>{
            res.json({
                message:"product saved"
            })
        }

    )
    .catch(
        (err)=>{
            console.log(err);
            res.status(500).json({
                message:"product not saved"
            })
        }
    )


 }
 export function getProducts(req, res) {
    Product.find()
        .then(products => {
            res.json(products);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "could not fetch products"
            });
        });
 }
export function deleteProduct(req, res) {
    if (!req.user) {
        res.status(403).json({
            message: "you need to login first"
        });
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(403).json({
            message: "you are not allowed to delete product"
        });
        return;
    }
const productId = req.params.id;

    Product.findOneAndDelete({ productId: productId })
        .then(product => {
            if (!product) {
                res.status(404).json({
                    message: "product not found"
                });
            } else {
                res.json({
                    message: "product deleted"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "could not delete product"
            });
        });
    }
    
export function updateProduct(req, res) {
    if (!req.user) {
        res.status(403).json({
            message: "you need to login first"
        });
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(403).json({
            message: "you are not allowed to update product"
        });
        return;
    }

    const productId = req.params.id;

    Product.findOneAndUpdate({ productId: productId }, req.body, { new: true })
        .then(product => {
            if (!product) {
                res.status(404).json({
                    message: "product not found"
                });
            } else {
                res.json({
                    message: "product updated",
                    product
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "could not update product"
            });
        });
}
export async function getProductById(req, res) {
    const productId = req.params.id;
    
    
        const product = await Product.findOne({ productId: productId });

        if (product==null) {
             res.status(404).json({
                message: "Product not found"

            })
            return
        }

        res.json({
            product: product
        })
    } 




