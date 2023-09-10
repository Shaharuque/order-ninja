import { Router,Request,Response } from "express";
import { addNewProduct ,deleteProduct, withoutDiscountedProducts} from "../controllers/product.controller";
import { getSingleProduct, getAllProducts } from "../models/products.model";
import { getAllProductList, getPublicUsers,productSearch } from "../controllers/public.controller";


const publicRouter = Router();

//get all product
publicRouter.get('/product',getAllProductList);
//get all users 
publicRouter.get('/user',getPublicUsers);
// publicRouter.post('/search',productSearch);
publicRouter.get('/search',productSearch);

// publicRouter.get('/')
// publicRouter.post('/product/search',getStoreProduct);

//a single store product

//get a single prodcut

// publicRouter.get('/:storeId',getStoreProduct);

publicRouter.get('/single/:productId', async (req:Request,res: Response)=>{
    try {
        const {productId} = req.params;
        const singleProduct = await getSingleProduct(productId);
        return res.json(singleProduct);

    } catch (error) {
        console.log(error);
    }
});

publicRouter.get('/without/discounted',withoutDiscountedProducts)

// publicRouter.post('/search',productSearch);
export default publicRouter;