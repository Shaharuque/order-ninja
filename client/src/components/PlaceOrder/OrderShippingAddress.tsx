
import React, { useEffect, useState } from "react";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { Form, Select, Button, Row, Col, Input, message, DatePicker } from "antd";
import axios from "axios";
import {
    getPathaoCity,
    getPathaoZone,
    getPathaoArea,
} from "../../services/pathao.service";
import CustomInstance from "../../lib/axios";
import { useGetUserInfoQuery } from "../../features/user/userApiSlice";

function OrderShippingAddress({ handleShipping, next }) {
    const { delivery_fee, setDeliveryFee, cartItems } = useShoppingCart();
    const [loading, setLoading] = useState(true);
    const [showDate, setShowDate] = useState(false);

    const [cityList, setCityList] = useState([]);
    const [zoneList, setZoneList] = useState([]);
    const [areaList, setAreaList] = useState([]);
    const userId = localStorage.getItem('user_id')
    console.log('User Id', userId)

    //getting user data
    const { data: userData, isLoading: userLaoding } = useGetUserInfoQuery({ userId })
    console.log('User Data', Number(userData?.city))

    useEffect(() => {
        if (userData) {
            const getZoneList = getPathaoZone(Number(userData?.city)).then((res) => {
                console.log('Zone List', res)
                setZoneList(
                    res.map((v) => ({ value: v.zone_id, label: v.zone_name }))
                );
            });

            const getAreaList = getPathaoArea(546).then((res) => {
                console.log('Area List', res)
                setAreaList(
                    res.map((v) => ({ value: v.area_id, label: v.area_name }))
                );
            });

        }
    }, [(userData?.city)])

    console.log('first zone list render', zoneList)



    const handleDeliverySelect = (v) => {
        if (v == 'weekly') {
            setShowDate(true);
        } else {
            setShowDate(false);
        }
    }

    const [formHook] = Form.useForm();



    useEffect(() => {
        const calls = async () => {
            const result = await getPathaoCity();
            setCityList(
                result.map((v) => ({
                    value: v.city_id,
                    label: v.city_name,
                }))
            );

            // const dur = await getPathaoZone(8);
            // console.log(`====================`,result);
            // console.log(`====================`,dur);
        };
        calls();
    }, []);

    const onFinish = async (values) => {
        console.log(values);

        if (Object.values(values).includes(undefined)) {
            message.error('please fill up all the fields');
            return;
        }
        // get shipping cost

        handleShipping(values);

        next();
    };

    const onCitySelect = async (cityId) => {
        const getZoneList = await getPathaoZone(cityId);
        formHook.resetFields(["zone", "area"]);
        setZoneList(
            getZoneList.map((v) => ({ value: v.zone_id, label: v.zone_name }))
        );
    };

    const onZoneSelect = async (zoneId) => {
        const getZoneList = await getPathaoArea(zoneId);
        formHook.resetFields(["area"]);
        setAreaList(
            getZoneList.map((v) => ({ value: v.area_id, label: v.area_name }))
        );
    };

    return (
        <div>
            <Form
                colon={true}
                onFinish={onFinish}
                layout="vertical"
                form={formHook}
                initialValues={{
                    city: 32,
                    zone: 546,
                    area: 7631,
                    phone: '01799856586',
                }}
            >
                <Row>
                    <Col span={10}>
                        <Form.Item required label="City" name="city">
                            <Select
                                onSelect={onCitySelect}
                                placeholder="Select your City"
                                options={cityList}
                            />
                        </Form.Item>
                    </Col>
                    <Col offset={4} span={10}>
                        <Form.Item label="Zone" required name="zone">
                            <Select
                                onSelect={onZoneSelect}
                                placeholder="select your zone"
                                options={zoneList}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item label="Area" name="area">
                            <Select
                                placeholder="select your area!"
                                options={areaList}
                            />
                        </Form.Item>
                    </Col>
                    <Col offset={4} span={10}>
                        <Form.Item name="phone" label="Phone">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item name="address" label="Address">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item name="order_type" label="Order Type">
                            <Select
                                onSelect={handleDeliverySelect}
                                placeholder="select order Type"
                                options={[
                                    {
                                        label: 'Standard',
                                        value: 'standard'
                                    },
                                    {
                                        label: 'Weekly',
                                        value: 'weekly'
                                    }

                                ]}
                            />
                        </Form.Item>
                    </Col>
                    {

                        showDate ? <Col offset={4} span={10}>
                            <Form.Item name="order_date" label="Order Date">
                                <DatePicker></DatePicker>
                            </Form.Item>
                        </Col> : null

                    }
                </Row>

                {/*  <Form.Item name="mobile"></Form.Item>
        <Form.Item name="email"></Form.Item>
        <Form.Item name="city"></Form.Item>
        <Form.Item name="area"></Form.Item>
        <Form.Item name="zone"></Form.Item>
        <Form.Item name="home"></Form.Item> */}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        ghost
                        style={{ width: "50%" }}
                        type="primary"
                        htmlType="submit"
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default OrderShippingAddress;
