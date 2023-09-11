import  {  Request, Response } from "express";

import stripe from "stripe";
import { getSingleProduct } from "../models/products.model";
import { generateUUID } from "../utils/generic.util";


// --- env ---
export const paymentController = async (req: Request, res: Response) => {
  try {

    const { user_id,address,order_type,price,order_date,items } = req.body;

    const stripeSecretKey = "sk_test_51K8U3bA8Wu6mzkGu5nh3VeyKBXsYzcknntMgfOne75UuPdvl2zincfWrFBxkOjQRwBZIjlODiNqrgLaGebi5DlCa00Ec2lfcDt";

    if (!stripeSecretKey) {
      throw new Error("Stripe Secret Key not found in environment variables");
    }

    const stripeClient = new stripe(stripeSecretKey, {
      apiVersion: "2023-08-16",
    });
    

    const rawProduct : any= [];
    for(let i =0;i<items.length;i++){
        const prd = await getSingleProduct(items[i].id);

        const newObj = {
            price_data : {
                currency : "usd",
                product_data : {
                    name : prd.name,
                    images : prd.images
                },
                unit_amount : prd.price*items[i].quantity
            },
            quantity : items[i].quantity
        }

        // console.log('#####',newObj.price_data.unit_amount);

        rawProduct.push(newObj);
    }

    // const lineItems = items.map((v : any) =>{
    //     return ({
    //         price_data:{
    //             currency:"usd",
    //             product_data:{
    //                 name:v.id,
    //                 images:[`https://gravatar.com/avatar/3dec4af0efb302ba0610ea2405ae5750?s=200&d=robohash&r=x`]
    //             },
    //             unit_amount: 69 * 100,
    //         },
    //         quantity:v.quantity
    //     });
    // })




    // console.log(rawProduct);

    const paymentId = await generateUUID();



    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: rawProduct,
      mode: "payment",

      success_url:`http://localhost:5173/success?id=${paymentId}`,
      cancel_url: `http://localhost:5173/cancel`,
    });



    return res.send({ id: session?.id });

  } catch (error) {
    console.log(error);
  }
};