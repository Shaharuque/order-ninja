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
    DatePicker,
} from "antd";

import { FormItemProps, UploadFile, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload/interface";
import axios from "axios";
import CustomInstance from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import { postProduct } from "../../services/Supply/supplyService";
import { ItemDetailsGenerate } from "../../utils/helpers/productDescriptionGenerator";
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

    const [expiryDate, setExpiryDate] = useState('')

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

    //Date handler
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(dateString);
        setExpiryDate(dateString)
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
        console.log(value)
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
                description: desc,
                expiry_date: expiryDate,
                images: imgUrls,
            };
            // const axr = await CustomInstance.post(
            //     `/product/${rawJson.store_id}`,
            //     newProduct
            // );

            //Service call
            postProduct(newProduct, rawJson);

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
            setDesc('')
            message.success(`Product Created!`);
        } catch (error) {
            console.log(error);
        }
        // console.log(ddr);
        // console.log(value);
        // console.log(ddr)
    };

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [loading, setLoading] = useState(false)
    const [isDescUpdated, setIsDescUpdated] = useState(false);
    const handleDescGenerate = async () => {
        if (title) {
            setLoading(true)
            const result = await ItemDetailsGenerate(title)
            if (result) {
                setDesc(result)
                setLoading(false)
                setIsDescUpdated(true)
            }

        }
    }
    console.log(desc)

    return (
        <Form
            form={productForm}
            name="form_item_path"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                ["description"]: desc
            }}
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
                        <Input onChange={(e) => setTitle(e.target.value)} placeholder="Product Name" />
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

            <div style={{display:'flex',flexDirection:'column', marginBottom:'10px'}}>
                <label>
                    Description
                </label>
                <textarea
                    style={{ width: '100%',border:'1px solid gray', borderRadius:'5px' }}
                    onChange={(e) => setDesc(e.target.value)}
                    defaultValue={isDescUpdated ? desc : undefined}
                    rows={8}
                    placeholder="Product Description" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button type="button" onClick={handleDescGenerate} style={{ padding: '5px', borderRadius: '5px' }}>Generate</button>
                {
                    loading && <span style={{ marginLeft: '10px' }}>Loading...</span>
                }
            </div>

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

            <Row>
                <Col span={10} >
                    <Form.Item label="Expiry Date">
                        <DatePicker onChange={onChange} />
                    </Form.Item>
                </Col>
                {/* <Col span={10} offset={4}>
                    <Form.Item
                        label="Discount"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                type: "number",
                                message: "Please input discount amount!",
                            },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Col> */}
            </Row>

            <Upload {...props}>
                <Button type="primary" ghost style={{ width: "230px", marginBottom: '16px' }} icon={<UploadOutlined />}>
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
