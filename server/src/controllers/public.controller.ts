import { Request,Response, response } from "express";
import { getAllProducts, searchProducts } from "../models/products.model";
import { getAllUsers } from "../models/user.model";


export async function getAllProductList(req:Request,res : Response){
    try {
        
        const result = await getAllProducts();
        return res.json(result);
    } catch (error) {
        return [];
    }
}
export async function productSearch(req:Request,res : Response){
    try {
        const {q,cat} = req.query;
        const result =await searchProducts(cat,q);

        res.status(200).json({
            status:true,
            data:result
        });
    } catch (error) {
        return [];
    }
}


export async function getPublicUsers(rew : Request,res : Response){
    try {
        const result = await getAllUsers();
        console.log('got public user list')
        return res.json(result);
    } catch (error) {
        return [];
    }
}
