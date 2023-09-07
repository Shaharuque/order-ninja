// import React from 'react'

// function ProductViewModal() {

//     const tempData = {
//         "id": "f5a3337a-e919-42ef-86db-60436c726a5b",
//         "store_id": "4d960af8-113e-4bdd-a020-459015625f7a",
//         "name": "small one",
//         "category": [
//             "jack2"
//         ],
//         "price": 12,
//         "stock": 677,
//         "description": "asdfdsf",
//         "images": [],
//         "reviews": [],
//         "unit_size": 12,
//         "weight": 10,
//         "createdAt": "2023-08-31T03:57:30.524Z",
//         "updatedAt": "2023-08-31T06:22:17.126Z",
//     }
//   return (
//     <div>

//     </div>
//   )
// }

// export default ProductViewModal

import { Modal, Carousel, Typography, Row, Col,Empty } from "antd";
import style from "./productviewmodal.module.css";
import SellerLayout from "../../layout/Seller/SellerLayout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomInstance from "../../lib/axios";
import { productView } from "../../services/Supply/supplyService";

const { Title, Text } = Typography;

interface ProductViewProps {
    imageUrls: string[];
    name: string;
    price: number;
    stock: number;
    description: string;
    sellerName: string;
}

const SellerProductView: React.FC = () => {
    const location = useLocation();
    const { state } = location;

    const [data, setData] = useState(null);

    console.log(location.state);

    // Service
    useEffect(() => {
        productView(state?.pid).then((res) => {
            console.log(`view product data : `, res);
            setData(res);
        });
    }, [state.pid]);
    return data ? (
        <SellerLayout>
            <div className="product-view">
                <Row  style={{height:'50vh',marginTop:'16px'}}>
                    <Col span={16} style={{marginTop:'min(7vh,16px)'}}>
                       

                        {data.images.length ? 
                         <Carousel className="product-carousel">
                         {data.images.map((imageUrl, index) => (
                             <div key={index}>
                                 <img
                                     width={"90%"}
                                     style={{borderRadius:'8px'}}
                                     src={imageUrl}
                                     alt={data.name}
                                 />
                             </div>
                         ))}
                     </Carousel>:
                     <Empty />
                    }
                    </Col>
                    <Col span={8} className={style['productStatDiv']}>
                        <div>

                        <Title level={3}>{data.name}</Title> 
                        </div>
                        <div>

                        <Text strong>Price:</Text> ৳ {data.price}
                        </div>
                        <div>

                        <Text strong>Current Stock:</Text> {data.stock}
                        </div>
                    </Col>
                </Row>
                <div className="product-details">

                    <h3>Description:</h3>
                    
                    <Text >{data.description}</Text> 
                    <br />
                    {/* <Text strong>Seller:</Text> {data.store_id} */}
                </div>
            </div>
        </SellerLayout>
    ) : (
        <div>he</div>
    );
};

export default SellerProductView;
