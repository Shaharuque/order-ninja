// import { Col, Row } from "antd";
// import { useState, useEffect, Dispatch, SetStateAction } from "react";
import style from "./Register.module.css";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
// import RegistrationForm from "./RegistrationForm";

// const imgUrls = [
//     "https://images.ctfassets.net/3s5io6mnxfqz/5GlOYuzg0nApcehTPlbJMy/140abddf0f3f93fa16568f4d035cd5e6/AdobeStock_175165460.jpeg",
//     "https://app.orderlion.com/img/slider/login-slider-3.jpg",
//     "https://app.orderlion.com/img/slider/login-slider-4.jpg",
//     "https://app.orderlion.com/img/slider/login-slider-7.jpg",
//     "",
// ];

// const getRandomImg = () => {
//     const randomIdx = Math.floor(Math.random() * imgUrls.length);
//     return imgUrls[randomIdx];
// };
// import { Button, message, Steps, theme } from "antd";
// import RgisterStep1 from "./RgisterStep1";
// import RegisterStep2 from "./RegisterStep2";

// const Register: React.FC = () => {
//     const { token } = theme.useToken();
//     const [current, setCurrent] = useState(0);
//     const [biz, setBiz] = useState("");
//     const [formInfo ,setFormInfo] = useState({});
//     const [mail,setEmal] = useState('');

//     const next = () => {
//         // if(current==2){
//             // }
//         setCurrent(current + 1);
//         console.log(formInfo,current);
//     };

//     const prev = () => {
//         setCurrent(current - 1);
//     };

//     const steps = [
//         {
//             title: "Who are You?",
//             content: <RgisterStep1 setValue={setBiz} setC={setCurrent} />,
//         },
//         {
//             title: "Information",
//             content: <RegisterStep2 setValue= {setEmal} setC={setCurrent} />,
//         },
//         {
//             title: "Verify",
//             content: "Last-content",
//         },
//     ];

//     const items = steps.map((item) => ({ key: item.title, title: item.title }));

//     const contentStyle: React.CSSProperties = {
//         // lineHeight: "260px",
//         // textAlign: "center",
//         // color: token.colorTextTertiary,
//         // backgroundColor: 'red',
//         // borderRadius: token.borderRadiusLG,
//         border: `3px solid ${token.colorBorder}`,
//         marginTop: 16,
//         // height: "100%",
//     };

//     return (
//         <div className={style["registerContainer"]}>
//             <div className={style["registerDiv"]}>
//                 {/* <div> */}
//                 <Steps current={current} items={items} />
//                 <div className={style["stepContent"]}>
//                     {steps[current].content}
//                 </div>
//                 {/* <div>
//                     {current < steps.length - 1 && (
//                         <Button type="primary" onClick={() => next()}>
//                             Next
//                         </Button>
//                     )}
//                     {current === steps.length - 1 && (
//                         <Button
//                             type="primary"
//                             onClick={() =>
//                                 message.success("Processing complete!")
//                             }
//                         >
//                             Done
//                         </Button>
//                     )}
//                     {current > 0 && (
//                         <Button
//                             style={{ margin: "0 8px" }}
//                             onClick={() => prev()}
//                         >
//                             Previous
//                         </Button>
//                     )}
//                 </div> */}
//             </div>
//         </div>
//     );
// };

// export default Register;

import type { CountdownProps } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Checkbox, Form, Input, Select, Statistic } from "antd";
import CustomInstance from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

type FieldType = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
};

type OtpFieldType = {
  code?: string;
};

const Register: React.FC = () => {
  const { Countdown } = Statistic;
  const navigator = useNavigate();
  const [otpStatus, setOtpStatus] = useState<boolean>(true);
  // const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Dayjs is also OK
  const deadline = Date.now() + 1000 * 2 * 60; // Dayjs is also OK

  const onFinish: CountdownProps["onFinish"] = () => {
    console.log("finished!");
    setOtpStatus(false);
  };

  const requestForOtp = async (values: any) => {
    let isbussiness = true;
    if (values.user_type == "supplier") {
      isbussiness = false;
    }
    values.isbussiness = isbussiness;
    localStorage.setItem("regTempData", JSON.stringify(values));

    try {
      const res = await CustomInstance.post("/register/request", values);
      console.log(res);
      setOtpStatus(true);

      // navigator("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const resetDataForOTP = async () => {
    let tempUserData = localStorage.getItem("regTempData");
    tempUserData = JSON.parse(tempUserData as string);

    try {
      const res = await CustomInstance.post("/register/request", tempUserData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const submitOtp = async (values: any) => {
    try {
      const res = await CustomInstance.post("/register/confirm", values);
      console.log(res);
      localStorage.removeItem("regTempData");
      navigator("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style["registerFormDiv"]}>
      {!otpStatus ? (
        <>
          <h1 style={{ marginBottom: "16px" }}>Register</h1>
          <Form
            name="basic"
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            style={{ width: 300 }}
            initialValues={{ remember: true }}
            onFinish={requestForOtp}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label=""
              name="first_name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined style={{ fontSize: "20px", color: "blue" }} />
                }
                placeholder="First Name"
              />
            </Form.Item>
            <Form.Item<FieldType>
              label=""
              name="last_name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined style={{ fontSize: "20px", color: "blue" }} />
                }
                placeholder="Last Name"
              />
            </Form.Item>

            <Form.Item<FieldType>
              label=""
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter your email",
                },
              ]}
            >
              <Input
                prefix={
                  <MailOutlined style={{ fontSize: "20px", color: "blue" }} />
                }
                placeholder="Enter your Email"
              />
            </Form.Item>

            <Form.Item name="user_type">
              <Select placeholder={"Register As:"}>
                <Select.Option value="supplier">Supplier</Select.Option>
                <Select.Option value="business">Business Owner</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label=""
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined style={{ fontSize: "20px", color: "blue" }} />
                }
                placeholder="Enter Your Password"
              />
            </Form.Item>

            <Form.Item style={{ width: "100%" }}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <p>
            I have an account go to <Link to="/login">Login now</Link> !
          </p>
        </>
      ) : (
        <>
          <h4>Input Your OTP</h4>
          <small style={{ marginBottom: "16px" }}>
            Check your mail & confirm by submitting your OTP
          </small>
          <Form
            name="basic"
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            style={{ width: 300 }}
            initialValues={{ remember: true }}
            onFinish={submitOtp}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<OtpFieldType>
              label=""
              name="code"
              rules={[{ required: true, message: "Please input OTP" }]}
            >
              <Input
                // prefix={
                //   <UserOutlined style={{ fontSize: "20px", color: "blue" }} />
                // }
                placeholder="O T P"
              />
            </Form.Item>

            <Form.Item style={{ width: "100%" }}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Confirm
              </Button>
            </Form.Item>
          </Form>
          <p>
            {" "}
            <Countdown
              title=""
              value={deadline}
              onFinish={onFinish}
              format="mm:ss"
            />
          </p>
          <p
            onClick={() => {
              resetDataForOTP();
            }}
            style={{ textDecoration: "underline", color: "blue" }}
          >
            Resend OTP
          </p>
        </>
      )}
    </div>
  );
};

export default Register;
