import React, { useState, useEffect } from 'react';
import SingleLatestSellerProduct from '../SingleLatestSellerProduct/SingleLatestSellerProduct';
import CustomInstance from '../../lib/axios';

const stl: React.CSSProperties = {
  // overflowY:'auto',
  backgroundColor: 'white',
  height: 'calc(58vh - 230px)',
  padding: '2px 8px',
  marginRight: '8px',
  borderRadius: '8px'
  // border:'1px solid red'
}

function SellerTopProducts() {

  const { id: user_id, store_id } = JSON.parse(localStorage.getItem('raw_user')!);

  const [topSell, setTopSell] = useState([]);

  useEffect(() => {
    const getLatestSales = async () => {
      try {
        const { data } = await CustomInstance.get(`/order/top-sales/${store_id}`);
        console.log(`🎈🎁🎀🎀🎁`)
        console.log(data);
        setTopSell(data);
      } catch (error) {

        console.log(error);
      }
    };

    getLatestSales();

  }, []);


  return (
    <div >
      <h4>Top 3 Products</h4>
      <div style={stl}>

        {topSell?.map((ts, i) => {
          const { name, images, sold } = ts?.res;
          // console.log(images)
          return <SingleLatestSellerProduct img={images[0]} value={sold} product_name={name} key={Math.random()} idx={i + 1} />;
        })}
      </div>
    </div>
  )
}

export default SellerTopProducts