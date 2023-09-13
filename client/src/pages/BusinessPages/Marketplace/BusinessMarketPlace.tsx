import React, { useEffect, useState } from "react";
import BusinessLayout from "../../../layout/Bussiness/BusinessLayout";
import MarketplaceSearchbar from "./MarketPlceSearchbar/MarketplaceSearchbar";
import MarketPlacebody from "./MarketPlaceBody/MarketPlacebody";
import { Col, Row, Select } from "antd";
import MarketProductCategory from "./MarketPlaceCategory/MarketProductCategory";
import { io } from "socket.io-client";

function BusinessMarketPlace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState({});
  const [update, forceUpdate] = useState(Date.now());
  const [socket, setSocket] = useState<any>(null);
  const store = {};
  const user = localStorage.getItem("email") || "{}";

  useEffect(() => {
    setSocket(io("http://localhost:3055")); //io thekey socket newa hoisey
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", { userId: user });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("newOrderCreated", (newOrder: any) => {
        // Handle the new order, e.g., update UI or show a notification
        console.log("New order created notification:", newOrder);
        // Update your UI or show a notification to the user
        localStorage.setItem("notification", JSON.stringify(newOrder));
      });
    }
  }, [socket]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    // Perform search logic here based on the search query
  };

  const handleCategory = (value: object) => {
    console.log(`selected `, value);
    setCategory((prv) => {
      if (prv == value.id) {
        return "";
      }
      return value.id;
    });
  };

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
