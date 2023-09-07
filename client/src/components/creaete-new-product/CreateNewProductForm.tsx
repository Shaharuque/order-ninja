import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Upload,
    Row,
    Col,
    Select,
    InputNumber,
} from "antd";

import { FormItemProps, UploadFile, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload/interface";
import axios from "axios";
import CustomInstance from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import { postProduct } from "../../services/Supply/supplyService";
const MyFormItemContext = React.createContext<(string | number)[]>([]);

interface MyFormItemGroupProps {
    prefix: string | number | (string | number)[];
    children: React.ReactNode;
}

function toArr(
    str: string | number | (string | number)[]
): (string | number)[] {
    return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }: MyFormItemGroupProps) => {
    const prefixPath = React.useContext(MyFormItemContext);
    const concatPath = React.useMemo(
        () => [...prefixPath, ...toArr(prefix)],
        [prefixPath, prefix]
    );

    return (
        <MyFormItemContext.Provider value={concatPath}>
            {children}
        </MyFormItemContext.Provider>
    );
};

const MyFormItem = ({ name, ...props }: FormItemProps) => {
    const prefixPath = React.useContext(MyFormItemContext);
    const concatName =
        name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

    return <Form.Item name={concatName} {...props} />;
};

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

function CreateNewProductForm({ updater, setOpen }) {
    const [productForm] = Form.useForm();

    const [uploading, setUploading] = useState(false);

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [catList, setCatList] = useState([]);

    const raw: string = localStorage.getItem("raw_user")!;
    const rawJson = JSON.parse(raw);
    // console.log(JSON.parse(raw));

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("file", file as RcFile);
        });
        setUploading(true);
        try {
            const rew = await axios.post(
                `http://localhost:3055/api/imgup`,
                formData
            );
            // setUrlList(rew.data)
            console.log(rew);
            // message.success(JSON.stringify(rew));
            // message.success("image uploaded!");
            return rew.data;
        } catch (error) {
            console.log("noob", error);
        }
    };

    const props: UploadProps = {
        name: "file",
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);

            return false;
        },
        fileList,
    };

    useEffect(() => {
        try {
            const apiCall = async () => {
                const { data } = await CustomInstance.get(`/category`);
                // console.log(data)
                setCatList(
                    data.map((cl) => ({ label: cl.name, value: cl.id }))
                );
            };
            apiCall();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const onFinish = async (value: object) => {
        // console.log(urlList);
        try {
            const imgUrls = await handleUpload();

            // id : String,
            // store_id : String,
            // name : String,
            // category : Array,
            // price : Number,
            // stock : Number,
            // description : String,
            // images : Array,
            // reviews : Array

            const newProduct = {
                ...value,
                images: imgUrls,
            };
            // const axr = await CustomInstance.post(
            //     `/product/${rawJson.store_id}`,
            //     newProduct
            // );

            //Service call
            postProduct(newProduct,rawJson);

            updater();
            setOpen(false);
            productForm.resetFields([
                "name",
                "category",
                "description",
                "unit_size",
                "price",
                "weight",
                "stock",
            ]);
            setFileList([]);
            message.success(`Product Created!`);
        } catch (error) {
            console.log(error);
        }
        // console.log(ddr);
        // console.log(value);
        // console.log(ddr)
    };

    return (
        <Form
            form={productForm}
            name="form_item_path"
            layout="vertical"
            onFinish={onFinish}
        >
            <Row>
                <Col span={12}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter product name!",
                            },
                        ]}
                    >
                        <Input placeholder="Product Name" />
                    </Form.Item>
                </Col>
                <Col span={8} offset={2}>
                    <Form.Item
                        name="category"
                        label="Select Category"
                        rules={[
                            {
                                required: true,
                                message: "Please input your product Category!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a category"
                            // onChange={handleChange}
                            options={catList}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                name="description"
                label="Description"
                rules={[
                    {
                        required: true,
                        message: "Please input your Description!",
                    },
                ]}
            >
                <Input.TextArea rows={3} placeholder="Product Description" />
            </Form.Item>

            <Row>
                <Col span={10}>
                    <Form.Item
                        label="Product's Unit Size"
                        name="unit_size"
                        rules={[
                            {
                                required: true,
                                type: "number",
                                message: "Please input your unit size!",
                            },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                <Col span={10} offset={4}>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            {
                                required: true,
                                type: "number",
                                message: "Please input your price!",
                            },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={10}>
                    <Form.Item
                        label="Weight"
                        name="weight"
                        rules={[
                            {
                                required: true,
                                type: "number",
                                message: "Please Enter Product weight!",
                            },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                <Col span={10} offset={4}>
                    <Form.Item
                        label="Stock Amount"
                        name="stock"
                        rules={[
                            {
                                required: true,
                                type: "number",
                                message: "Please input Stock Amount!",
                            },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
            </Row>

            <Upload {...props}>
                <Button type="primary" ghost  style={{ width: "230px" ,marginBottom:'16px'}} icon={<UploadOutlined />}>
                    Select File
                </Button>
            </Upload>

            <Row>
                <Col span={12} offset={4}>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            danger
                            style={{ width: "100%" }}
                            type="primary"
                            htmlType="submit"
                            onClick={handleUpload}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default CreateNewProductForm;
