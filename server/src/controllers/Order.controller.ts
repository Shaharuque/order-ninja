import {Request,Response} from 'express';
import { createSuplierOrder, getLastestSalesByStore, 
    getStoreOrders, updateOrderStatus,getTopNSalesByStore,getUserOrders, storeWeeklyStats } from '../models/distributedOrder.model';
import { getSingleProduct, productModel } from '../models/products.model';
import { generateUUID, getLastWeekDays } from '../utils/generic.util';





// export async function getSingleOrder(req :Request, res : Response ){


// }
// export async function getOrdersByUser(req :Request, res : Response ){

// }

// export async function getOrdersByStore(req :Request, res : Response ){

// }


// export async function getAllOrders(req :Request, res : Response ){

// }
export async function createOrder(req :Request, res : Response ){

    try {
        // console.log(req.body)
        const {items } = req.body;
        console.log('order confirmed',items)
        
        const user_order_id  = await generateUUID();

        const ordersByItems : any = [];

        for(let i = 0;i<items.length;i++){
            const rs = await getSingleProduct(items[i].id);
            if(rs){
                const productObj = {
                    product_id : rs.id,
                    store_id:rs.store_id,
                    buyer_id:req.body.user_id,
                    quantity : items[i].quantity,
                    address : req.body.address,
                    total_price :items[i].quantity *  rs.price,
                    total_unit_size : items[i].quantity * Number(rs.unit_size),
                    total_weight : items[i].quantity * Number(rs.weight),
                    price : rs.price,
                    unit_size : rs.unit_size,
                    weight : rs.weight,
                    product_name : rs.name,
                    order_type : req.body['order_type'],
                    order_date : req.body['order_date']
                }
                ordersByItems.push(productObj);
            }
        }
        // console.log(`=======================`);
        // console.log(req.body.address)
        // console.dir(ordersByItems,{depth: 4});

        //now create sellers order one by one 
        
        for(let i =0;i<ordersByItems.length;i++){
            const rs = await createSuplierOrder(ordersByItems[i]);
            // storeOrderIds.push(rs.id);
            // console.log(rs);
        }

        // create user order





        res.send('done');
    } catch (error) {
        return res.json(error);
    }
}
export async function getOrdersByStoreId(req :Request, res : Response ){

    try {
        const {storeId} = req.params;

        const result :any = await getStoreOrders(storeId);

        let refined :any[]= [];

        for(let i =0;i<result.length;i++)
        {
            const {name : product_name,images,stock,sold} = await getSingleProduct(result[i]['product_id']);
            const newObj = {product_name,images,stock : stock-sold };

            // console.log('========',sold)
            refined.push({... result[i]['_doc'],...newObj});
        }
        
        res.json(refined);
    } catch (error) {
        return res.json(error);
    }
}

export async function confirmOrderBySeller(req : Request,res : Response) {
    try {
        
        const {order_id,product_id,amount } = req.body;

        const dt = await updateOrderStatus(order_id,'confirmed');

        const pdUpdate =  await productModel
                            .findOneAndUpdate({id : product_id},{$inc : {sold:amount}}) ;//update product
       
        return res.json(order_id);
        
    } catch (error) {
        console.log(error);
    }
};

export async function getLatestSales(req:Request,res : Response){

    try {
        const {storeId} = req.params;
        const dtd = await getLastestSalesByStore(storeId);

        const finalResult : any[] = [];

        for(let i =0;i<dtd.length;i++){
            // console.log(dtd[i].id);
            const result = await getSingleProduct(dtd[i].product_id);

            // console.log(result);

            const newObj = {order : dtd[i],product : result};
            finalResult.push(newObj);
        }
        return res.json(finalResult);
        
    } catch (error) {
        return res.send(error);
    }

}
export async function getTopSales(req:Request,res : Response){
    try {
        const {storeId} = req.params;

        const dtd = await getTopNSalesByStore(storeId);

        for(let i =0;i<dtd.length;i++){
            const result = await getSingleProduct(dtd[i]['_id']);
            dtd[i]['res'] = result;
        }

        return res.json(dtd.sort( (a,b)=> b.totalOrder - a.totalOrder ));
    } catch (error) {
        return res.send(error);
    }
}


export async function getUserOrdersById(req:Request,res : Response) {

    try {

        const {userId} = req.params;

        const result = await getUserOrders(userId);
        
        return res.json(result);
    } catch (error) {
        throw error;   
    }
}

export async function getStoreWeeklyStats(req : Request ,res : Response) {
    try {
        const {storeId} = req.params;
        const rd = await storeWeeklyStats(storeId);
        let defaultResult = getLastWeekDays().map( (v:any) => ({...v,price : 0,quantity : 0 }));

        rd.forEach( v =>{
                for(let i =0;i<defaultResult.length;i++){
                    if(defaultResult[i].weekday ==v.day_name){
                        defaultResult[i] = {...defaultResult[i],...v};
                    }
                }
        });
        // console.log(storeId)
        res.json(defaultResult);
    } catch (error) {
        return res.sendStatus(500).send(error);
    }
}