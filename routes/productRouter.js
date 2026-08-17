import express from 'express';
 import { createProduct, getProducts,deleteProduct, updateProduct, getProductById } from '../controller/productControll.js';

 const productRouter=express.Router();


 productRouter.post('/',createProduct)
 productRouter.get('/',getProducts)
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);
productRouter.get('/:id',getProductById);



 export default productRouter;
