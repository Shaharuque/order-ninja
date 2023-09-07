import React, { useRef, useEffect, useState } from "react";
import style from "./MarketProduct.module.css";
import CustomInstance from "../../../../lib/axios";
import { getAllCategory } from "../../../../services/Business/businessServices";

function MarketProductCategory({onCatChange ,selected} : any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [catList, setCatList] = useState([]);

    // useEffect(() => {
    //     try {
    //         const apiCall = async () => {
    //             const res = await CustomInstance.get("/category");
    //             setCatList(res.data);
    //         };
            
    //         apiCall();
    //         console.log(`🎗🎁🎁🎁🎀🧧`,selected);
    //         // console.log(tst);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }, [catList.length,selected]);

    // 2.get all the category
    useEffect(() => {
        getAllCategory().then((res)=>{
            setCatList(res);;
        });
    }, [catList.length,selected]);

    const handleWheelScroll = (e: React.WheelEvent) => {
        if (containerRef.current) {
            const delta = e.deltaY;
            const currentScrollLeft = containerRef.current.scrollLeft;
            containerRef.current.scrollLeft = currentScrollLeft + delta;
        }
    };

    const handleCatSelect = (id)=>{
        onCatChange(id);
    };

    return (
        <div
            className={style["scrollContainer"]}
            ref={containerRef}
            onWheel={handleWheelScroll}
        >
            {catList.map((cat) => {
                return (
                    <button style={cat.id == selected ? {backgroundColor:'#b7e6a9'} : null } onClick={()=> handleCatSelect(cat) } className={style['singleCategory']} key={Math.random()}>
                        <img width={28} height={24} src={cat.image} alt="" />
                        <span style={{marginLeft:'4px'}}>{cat.name}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default MarketProductCategory;
