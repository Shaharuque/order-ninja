import { Button } from 'antd'
import React,{useEffect} from 'react';
import { useShoppingCart } from '../../context/ShoppingCartContext';
import CustomInstance from '../../lib/axios';
import {loadStripe} from '@stripe/stripe-js';

const PUBLIK_KEY=`pk_test_51K8U3bA8Wu6mzkGuZsrT10w2wnveRW9iGAKLXMSIaAaiVCbAQWBCTf0hTqOc6KdlyMmOPJkkBO5vyvKzjSRPyLps00DZH6fW4z`;


function OrderPayment({next,amount,shipping}) {

    const {cartItems} = useShoppingCart();

    const createOrder  = async()=>{

        //place the order 
        // console.log(shipping)
            const orderData = {
                user_id  : localStorage.getItem('user_id'),
                address : {
                    city  : shipping.city,
                    zone : shipping.zone,
                    area : shipping.area,
                    address : shipping.address,
                    phone : shipping.phone
                },
                order_type : shipping.order_type,
                price : amount,
                order_date : shipping['order_date'],
                items :[...cartItems]
            };
            // console.log(orderData);
            try {
                
                const requ = await CustomInstance.post(`/order/create`,orderData);
                localStorage.removeItem('shopping-cart');
            } catch (error) {
                console.log(error);
            }
    }

    

    const makePayment = async()=>{
        const stripe = await loadStripe(PUBLIK_KEY);

        const orderData = {
            user_id  : localStorage.getItem('user_id'),
            address : {
                city  : shipping.city,
                zone : shipping.zone,
                area : shipping.area,
                address : shipping.address,
                phone : shipping.phone
            },
            order_type : shipping.order_type,
            price : amount,
            order_date : shipping['order_date'],
            items :[...cartItems]
        };

        const {data : session} = await CustomInstance.post(`/payment`,orderData);
        await createOrder();

        const result =await stripe?.redirectToCheckout({
            sessionId : session.id
        });

        if(result?.error){
            console.log(result.error);
        }
    }



  return (
    <div>
        {/* <h3>  {amount}  </h3> */}
        <Button type='primary' size='large' onClick={makePayment}>Pay With Stripe</Button>

    </div>
  )
}

export default OrderPayment