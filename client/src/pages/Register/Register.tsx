import style from "./Register.module.css";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
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
  const [otpStatus, setOtpStatus] = useState<boolean>(false);
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
