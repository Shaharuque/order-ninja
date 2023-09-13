import { Row } from "antd";
import React, { useEffect, useState } from "react";
import { getALlProducts } from "../../../../services/Business/allProducts";
import SingleProductCard from "../SingleProductCard/SingleProductCard";
import CustomInstance from "../../../../lib/axios";
import { getAllSearchedProducts } from "../../../../services/Business/businessServices";
import { useGetNoDiscountedProductsQuery } from "../../../../features/products/productsApiSlice";

interface IMarketPlaceBody {
    query: string;
}

function MarketPlacebody({ query, category }: any) {
    const [productList, setProductList] = useState([]);
    const { data: allNonDiscounted, isLoading: nonDiscountedLoading } = useGetNoDiscountedProductsQuery({});

    useEffect(() => {
        getAllSearchedProducts(query, category).then((res) => {
            setProductList(res);
        });
    }, [query, category, productList.length]);


    return (
        <div style={{ marginTop: "8px" }}>
            <h1 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Top Discounted products
            </h1>
            <div
                style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "30px",
                }}
            >
                {productList?.map((prdc) => {
                    return <SingleProductCard key={Math.random()} productInfo={prdc} />;
                })}
            </div>

            <h1 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Popular Products
            </h1>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {allNonDiscounted?.result?.map((prdc: any) => {
                    return <SingleProductCard key={Math.random()} productInfo={prdc} />;
                })}
            </div>
        </div>
    );
}

export default MarketPlacebody;
