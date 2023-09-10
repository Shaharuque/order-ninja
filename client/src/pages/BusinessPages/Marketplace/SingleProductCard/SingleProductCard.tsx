import React, { useContext, useState } from "react";
import style from "./productcard.module.css";
import { Card, Image, Button, Modal, Row, Col } from "antd";
import ShoppingCartContext from "../../../../context/ShoppingCartContext";


function SingleProductCard({ productInfo }: any) {
    console.log('product Info : ',productInfo)
    const [count, setCount] = useState(0);
    const [showOptions, setShowOptions] = useState(false);

    const [currentStock, setCurrentStock] = useState(productInfo.stock);
    const { increaseCartQuantity, decreaseCartQuantity } =
        useContext(ShoppingCartContext);

    const handleAdd = () => {
        if (!currentStock) {
            return;
        }
        increaseCartQuantity(productInfo.id);
        setCount((prev) => prev + 1);
        setCurrentStock((pr) => pr - 1);
    };
    const handleDecrese = () => {
        setCount((v) => v - 1);
        decreaseCartQuantity(productInfo.id);
        setCurrentStock((pr) => pr + 1);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDetails = () => {};

    return (
        <div className={style["parentCardContainer"]}>
            <div
                className={style["cardContainer"]}
                onMouseEnter={() => setShowOptions(true)}
                onMouseLeave={() => setShowOptions(false)}
                style={{
                    backgroundImage: `url(${productInfo.images[0]})`,
                }}
            >
                <div
                    className={style["hiddenCardContainer"]}
                    style={{
                        height: showOptions ? "250px" : 0,
                        opacity: showOptions ? 0.9 : 0,
                    }}
                >
                    <div className={style["hiddenCard"]}>
                        {count ? (
                            <div className={style["countCardContainer"]}>
                                <p>${count * productInfo.price}</p>

                                <div className={style["realCartContainer"]}>
                                    <button
                                        className={style["circleButton"]}
                                        onClick={handleAdd}
                                    >
                                        <span className={style["cartSign"]}>
                                            +
                                        </span>
                                    </button>
                                    <h3 className={style["cartCount"]}>
                                        {count}
                                    </h3>
                                    <button
                                        className={style["circleButton"]}
                                        onClick={handleDecrese}
                                    >
                                        <span className={style["cartSign"]}>
                                            -
                                        </span>
                                    </button>
                                </div>
                                <p>Available : {currentStock} units</p>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(true);
                                    }}
                                    className={style["productDetails"]}
                                >
                                    Details
                                </button>
                            </div>
                        ) : (
                            <div>
                                <button
                                    onClick={handleAdd}
                                    className={style["addToCart"]}
                                >
                                    <p>Add</p>
                                    <p>To</p>
                                    <p>Cart</p>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(true);
                                    }}
                                    className={style["productDetails"]}
                                >
                                    Details
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className={style["productDetailsDiv"]}>
                <p> {productInfo.name} </p>
                {
                    productInfo.discount > 0 ? (
                        <h3 className={style["originalPrice"]}> ৳{productInfo.price} </h3>
                    ):
                    <h3> ৳{productInfo.price} </h3>
                }
                {
                    productInfo.discount > 0 ? (
                        <h2 className="text-red-500">৳{productInfo.price - (productInfo.price * productInfo?.discount)}</h2>
                    ) : null
                }
                <p> {productInfo.weight} kg </p>
            </div>

            <Modal
                title={productInfo.name}
                footer={null}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    {/* <Col> */}
                    <img
                        style={{ height: "200px", display: "block" }}
                        src={productInfo.images[0]}
                    ></img>
                    <div></div>
                    {/* </Col> */}
                    {/* <Col offset={4}> */}
                    <p>Description : </p>
                    <p style={{ backgroundColor: "#fff", padding: "4px 8px" }}>
                        {" "}
                        {productInfo.description}{" "}
                    </p>

                    <div
                        style={{
                            borderBottom: "1px solid black",
                            marginTop: "8px",
                        }}
                    ></div>

                    <p>Price : {productInfo.price} </p>
                    <p>Weight : {productInfo.weight} </p>
                    <p>Availabe : {productInfo.stock} units</p>
                    {/* <div style={{borderBottom:'1px solid black',marginTop:'8px'}}></div> */}

                    {/* </Col> */}
                </div>
            </Modal>
        </div>
    );
}

export default SingleProductCard;
