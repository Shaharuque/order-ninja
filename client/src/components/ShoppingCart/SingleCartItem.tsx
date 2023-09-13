import React, { useState, useEffect, useContext } from "react";
import CustomInstance from "../../lib/axios";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import ShoppingCartContext from "../../context/ShoppingCartContext";
import { Empty } from "antd";



interface ISingleCartComp {
    itemId: string;
    quantity: number | string;
}

const SingleCartItem: React.FC<ISingleCartComp> = ({ itemId, quantity }) => {
    const [itemData, setItemData] = useState(null);

    const { increaseCartQuantity, decreaseCartQuantity } = useContext(ShoppingCartContext);

    const handleUp = () => {



        console.log(`up for `, itemData.name);
        increaseCartQuantity(itemData.id);
    }

    const handleDown = () => {
        console.log(`up for `, itemData.name);
        decreaseCartQuantity(itemData.id);
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const { data } = await CustomInstance(
                    `/product/single/${itemId}`
                );
                console.log(data);
                setItemData(data);
            } catch (error) {
                console.log(error);
            }
        };

        getProduct();
    }, [itemId, quantity]);

    {
        return itemData ? (
            <div style={{ display: "flex", gap: '8px', alignItems: "center", marginBottom: '8px' }}>
                <div
                    style={{
                        display: "flex",
                        width: '30px',
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <button onClick={handleUp}> <UpOutlined /> </button>
                    {quantity}
                    <button onClick={handleDown}> <DownOutlined /> </button>
                </div>

                <div>
                    <img
                        height={48}
                        width={48}
                        src={itemData?.images[0]}
                        alt=""
                    />
                </div>
                <div style={{ width: '250px', textAlign: 'center' }} > {itemData.name} </div>
                <div style={{ width: '60px' }}> ৳ {quantity * (itemData.price - (itemData.price * itemData.discount))} </div>
            </div>
        ) : (
            <Empty />
        );
    }
};

export default SingleCartItem;
