import mongoose from "mongoose";
import { generateUUID } from "../utils/generic.util";

export interface IProduct {
    id : string,
    store_id : string,
    name : string,
    category : string[],
    price : number,
    stock:number,
    sold : number,
    description  : string,
    images : string[],
    unit_size:string,
    weight : string,
    reviews : [],
    expiry_date : Date,
    discount : number,
}
const productSchema = new mongoose.Schema<IProduct>({
    id : String,
    store_id : String,
    name : String,
    category : Array,
    price : Number,
    stock : {
        type:'number',
        min:0
    },
    sold:{
        type:'number',
        default : 0
    },
    description : String,
    images : Array,
    reviews : Array,
    unit_size:Number,
    weight:Number,
    expiry_date : Date,
    discount : Number,

},{
    timestamps : true
});

export const productModel = mongoose.model<IProduct>('product',productSchema);

export async function getProductsByStore(storeId:string){
    try {
        const productLists = await productModel.find<IProduct[]>({store_id :storeId}).exec();
        return productLists;
    } catch (error) {
        throw error;
    }
}

export async function getSingleProduct(productId : string) :Promise<IProduct> {
    try {  
        const product = await productModel.findOne({id : productId}).exec();
        return product!;
    } catch (error) {
        throw error;
    }
}

export async function createSingleProduct(poductInfo : IProduct) {
    try {
        
        const newProduct = await productModel.create(poductInfo);
        return newProduct;
        
    } catch (error) {
        throw error;
    }
    
}


export async function deleteSingleProduct(productId :string){
    try {
        const result = await productModel.deleteOne({id : productId}).exec();
        return result;
    } catch (error) {
        throw error;
    }
}
export async function updateSingleProduct(productId :string,newObj : any){
    try {
        const result = await productModel.updateOne({id : productId},newObj).exec();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getAllProducts(){
    try {
        const res = await productModel.aggregate([
            {
                $match:{

                }
            },
            {
                $lookup:{
                    from:'stores',
                    localField:'store_id',
                    foreignField:'id',
                    as : "store"
                }
            }
        ]);
        return res;
    } catch (error) {
        throw error;
    }
}

export async function searchProducts(category : any,text : any){

    const filter : any = {};
  if (text) {
    filter.name = { $regex: text.trim(), $options: 'i' };
  }

  // Add category search criteria if provided
  if (category) {
    filter.category = { $in: category };
  }

  try {
    const results = await productModel.find(filter);
    return results;
  } catch (error) {
    throw error;
  }
}

