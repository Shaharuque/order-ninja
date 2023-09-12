import React, { useState } from "react";
import BusinessLayout from "../../../layout/Bussiness/BusinessLayout";
import MarketplaceSearchbar from "./MarketPlceSearchbar/MarketplaceSearchbar";
import MarketPlacebody from "./MarketPlaceBody/MarketPlacebody";
import { Col, Row, Select } from "antd";
import MarketProductCategory from "./MarketPlaceCategory/MarketProductCategory";

function BusinessMarketPlace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState({});
  const [update, forceUpdate] = useState(Date.now());
  const store = {};

  const handleSearch = (value: any) => {
    setSearchQuery(value);
    // Perform search logic here based on the search query
  };
  const handleCategory = (value: object) => {
    console.log(`selected `, value);
    setCategory((prv) => {
      if (prv == value?.id) {
        return "";
      }
      return value.id;
    });
  };

  return (
    <BusinessLayout>
      <Row>
        <Col span={12}>
          <MarketplaceSearchbar onSearch={handleSearch} />
        </Col>
      </Row>
      <Row>
        <MarketProductCategory
          selected={category}
          onCatChange={handleCategory}
        />
      </Row>

      <MarketPlacebody query={searchQuery} category={category} />
    </BusinessLayout>
  );
}

export default BusinessMarketPlace;
