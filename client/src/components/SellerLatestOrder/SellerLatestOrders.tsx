import React, { useEffect, useState } from 'react';
import SingleLatestSellerProduct from '../SingleLatestSellerProduct/SingleLatestSellerProduct';
import style from './Sellerorders.module.css';
import CustomInstance from '../../lib/axios';

function SellerLatestOrders() {

  const { id: user_id, store_id } = JSON.parse(localStorage.getItem('raw_user')!);
  const [latestSell, setLatestSell] = useState([]);


  useEffect(() => {
    const getLatestSales = async () => {
      try {
        const { data } = await CustomInstance.get(`/order/latest-sales/${store_id}`);

        setLatestSell(data);
        console.log(data);

      } catch (error) {

        console.log(error);
      }
    };
    getLatestSales();

  }, []);


  return (
    <div className={[style["latestSales"]].join(" ")}>
      <h2>Latest Sales</h2>

      {
        latestSell.length > 0 &&
        latestSell.map((s, i) => {

          // console.log('🎆🎆🎪🎪🎭',s)
          const { product: { images, name, sold }, order: { quantity } } = s;

          return <SingleLatestSellerProduct value={quantity} img={s?.images[0]} product_name={s?.name} key={Math.random()} idx={i + 1} />

        })}

      {/* <SingleLatestSellerProduct idx={2}/> */}
      {/* <SingleLatestSellerProduct idx={3}/>
                    <SingleLatestSellerProduct idx={4}/>
                    <SingleLatestSellerProduct idx={5}/>
                    <SingleLatestSellerProduct idx={2}/>
                    <SingleLatestSellerProduct idx={3}/> */}
    </div>
  )
}

export default SellerLatestOrders