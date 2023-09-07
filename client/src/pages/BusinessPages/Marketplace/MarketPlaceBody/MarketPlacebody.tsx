import { Row } from "antd";
import React, { useEffect, useState } from "react";
import { getALlProducts } from "../../../../services/Business/allProducts";
import SingleProductCard from "../SingleProductCard/SingleProductCard";
import CustomInstance from "../../../../lib/axios";
import { getAllSearchedProducts } from "../../../../services/Business/businessServices";


interface IMarketPlaceBody {
    query: string;
}

function MarketPlacebody({ query  , category }  : any) {
    const [productList, setProductList] = useState([]);

    // useEffect(() => {
    //     const pd = async () => {
    //         // const result = await getALlProducts();
    //         const {data} = await CustomInstance.get(`/public/search?q=${query}&cat=${category}`);
    //         console.log(`query  :${query}   category : ${category}`)
    //         // console.log('✨✨🎇🎆',re);
    //         // console.log(result);
    //         setProductList(data);
    //     };
    //     pd();
    // }, [query, category, productList.length]);

    //3. get all the searched products
    useEffect(() => {
        getAllSearchedProducts(query,category).then((res)=>{
            setProductList(res);
        });
    }, [query, category, productList.length]);

    return (
        <div style={{  marginTop: "8px" }}>
           
            {/* <div>
                <p> search = {query}</p>
                <p>cat = {category}</p>
                
                <span>{new Date().toLocaleTimeString()}</span>
            </div> */}

            <div style={{display:'flex',gap : '16px',flexWrap:'wrap'}}>
                {productList?.map((prdc) => {
                    // console.log(`=`.repeat(20));
                    // console.log(prdc);
                    return <SingleProductCard key={Math.random()} productInfo={prdc} />;
                })}
            </div>
        </div>
    );
}

export default MarketPlacebody;
