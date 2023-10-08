import React, { useEffect, useContext } from "react";
import BusinessLayout from "../../layout/Bussiness/BusinessLayout";
import { useState } from "react";
import { Button, message, Steps, theme } from "antd";

import OrderShippingAddress from "./OrderShippingAddress";
import cartContext from "../../context/ShoppingCartContext";
import useAuth from "../../hooks/useAuth";
import OrderSummary from "./OrderSummary";
import OrderPayment from "./OrderPayment";


// function orderSummary(cartObj)=>{

// }

function PlaceOrder() {

    const { token } = theme.useToken();
    const [shipping, setShippingInfo] = useState({});

    const [totalCost, setTotalCost] = useState(0);

    const handleTotalCost = (n) => {
        setTotalCost(n);
    }


    const [current, setCurrent] = useState(0);

    const handleShipping = (data) => {
        setShippingInfo(data);
    }

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const steps = [
        {
            title: "Shipping",
            content: <OrderShippingAddress next={next} handleShipping={handleShipping} />,
        },
        {
            title: "Order Summary",
            content: <OrderSummary shipping={shipping} setTotal={handleTotalCost} next={next} />,
        },
        {
            title: "Payment",
            content: <OrderPayment shipping={shipping} amount={totalCost} next={next} />,
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <BusinessLayout>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>

                <Steps size="small" style={{ width: '50vw' }} current={current} items={items} />
            </div>
            <div
                style={{
                    // backgroundColor: "gray",
                    marginTop: "16px",
                    padding: "16px",
                }}
            >
                {steps[current].content}
                {/* {JSON.stringify(shipping)} */}
            </div>

            <div style={{ marginTop: 24 }}>
                {/* {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={() => message.success("Processing complete!")}
                    >
                        Done
                    </Button>
                )} */}
                {current > 0 && (
                    <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                        Previous
                    </Button>
                )}
            </div>
        </BusinessLayout>
    );
}

export default PlaceOrder;
