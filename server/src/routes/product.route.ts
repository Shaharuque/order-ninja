import { Router,Request,Response } from "express";
import { getStoreProduct,addNewProduct ,deleteProduct, getAllProductList} from "../controllers/product.controller";
import { getSingleProduct, updateSingleProduct } from "../models/products.model";


const productRouter = Router();



productRouter.get('/',getAllProductList);
productRouter.get('/:storeId',getStoreProduct);
productRouter.post('/:storeId',addNewProduct);

productRouter.get('/delete/:productId',deleteProduct);
productRouter.get('/single/:productId', async (req:Request,res: Response)=>{
    try {
        const {productId} = req.params;
        const singleProduct = await getSingleProduct(productId);
        return res.json(singleProduct);

    } catch (error) {
        console.log(error);
    }
});
productRouter.post('/update/:productId', async (req:Request,res: Response)=>{
    try {

        console.log("i am here");
        const {productId} = req.params;
        const oldProduct = await getSingleProduct(productId);
        
        oldProduct!.name = req.body.name;
        oldProduct!.category = [req.body.category];
        oldProduct!.description = req.body.description;
        oldProduct!.price = req.body.price;
        oldProduct!.weight = req.body.weight;
        oldProduct!.stock = req.body.stock + req.body.new_stock;

        const updatedProduct = updateSingleProduct(productId,oldProduct);

        

        // console.log(`new = `,oldProduct);

        

        return res.json(updatedProduct);
        // res.send("great")

    } catch (error) {
        console.log(error);
    }
});




export default productRouter;