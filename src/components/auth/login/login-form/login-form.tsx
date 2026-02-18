"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, message } from "antd";

import AuthFormFooter from "@/components/auth/common/auth-form-footer/auth-form-footer";
import { authRoutes } from "@/lib/apis/routes";
import type { LoginDto } from "@/lib/apis/swagger/auth-types";

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const onFinish = async (values: LoginDto) => {
    setIsSubmitting(true);

    try {
      await authRoutes.login(values);
      messageApi.success("Login successful.");
      router.push("/");
    } catch (error) {
      const fallbackMessage = "Unable to login right now.";
      const errorMessage =
        error instanceof Error ? error.message : fallbackMessage;

      messageApi.error(errorMessage || fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form<LoginDto>
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email." },
            { type: "email", message: "Please enter a valid email." },
          ]}
        >
          <Input placeholder="you@company.com" size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password." },
            { min: 8, message: "Password must be at least 8 characters." },
          ]}
        >
          <Input.Password placeholder="Enter password" size="large" />
        </Form.Item>

        <Form.Item style={{ marginTop: 8, marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
            block
          >
            Log in
          </Button>
        </Form.Item>

        <AuthFormFooter
          question="New here?"
          actionText="Create an account"
          actionHref="/sign-up"
        />
      </Form>
    </>
  );
};

export default LoginForm;
