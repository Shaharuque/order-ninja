import {Request,Response} from 'express';
import { createSingleProduct, getProductsByStore,deleteSingleProduct, getAllProducts, getNoDiscountedProducts } from '../models/products.model';
import { generateUUID } from '../utils/generic.util';
import { IProduct } from '../models/products.model';

export async function getStoreProduct(req : Request,res:Response){
    try {
        const {storeId} = req.params;
        // console.log('here product',storeId)
        if(!storeId){
            return res.status(404).json({
                error : "no store id provied"
            });
        }
        const dbResut = await getProductsByStore(storeId);
        return res.status(200).json(dbResut);
    } catch (error) {
        throw error;
    }
}


export async function addNewProduct(req : Request, res : Response){
    try {
        const id = await generateUUID();
        // console.log(req.body);
        const productId = await generateUUID();
        const newRawProduct :IProduct= {
            id : productId,
            store_id : req.params.storeId,
            name : req.body.name,
            category : [req.body.category],
            price : req.body.price,
            weight : req.body.weight,
            unit_size:req.body.unit_size,
            stock  : req.body.stock,
            sold:0,
            description : req.body.description,
            images : req.body.images,
            reviews : [] ,
            expiry_date : req.body.expiry_date,
            discount : 0,
        };
        const rs = await createSingleProduct(newRawProduct);
        return res.send("nice");

    } catch (error) {
        
    }
}

export async function deleteProduct(req:Request,res : Response){
    try {
        const pid = req.params.productId;
        console.log(`here : pid = ${pid}`)
        const result = await deleteSingleProduct(pid);
        return res.send("done");
    } catch (error) {
        return res.send("can't not delete");
    }
}
export async function getAllProductList(req:Request,res : Response){
    try {
        
        const result = await getAllProducts();
        return res.json(result);
    } catch (error) {
        return res.send("can't not delete");
    }
}


export const withoutDiscountedProducts= async (req:Request,res:Response)=>{
    try{
        const result=await getNoDiscountedProducts();
        return res.status(200).json({
            success:true,
            result
        });

    }catch(err){
        console.log(err);
    }
}


