"use client";

import { useState } from "react";
import { Button, Form, Input, Select, message } from "antd";

import AuthFormFooter from "@/components/auth/common/auth-form-footer/auth-form-footer";
import { authRoutes } from "@/lib/apis/routes";
import type { AuthRole, SignupDto } from "@/lib/apis/swagger/auth-types";

const roleOptions: { label: string; value: AuthRole }[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Staff", value: "STAFF" },
];

const SignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignupDto) => {
    setIsSubmitting(true);

    try {
      await authRoutes.signup(values);
      messageApi.success(
        "Signup request submitted. Please verify from your email.",
      );
    } catch (error) {
      const fallbackMessage = "Unable to submit signup request right now.";
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
      <Form<SignupDto>
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          label="Work email"
          name="email"
          rules={[
            { required: true, message: "Please enter your work email." },
            { type: "email", message: "Please enter a valid email." },
          ]}
        >
          <Input placeholder="you@company.com" size="large" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role." }]}
        >
          <Select
            size="large"
            placeholder="Select your role"
            options={roleOptions}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 8, marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
            block
          >
            Create account
          </Button>
        </Form.Item>

        <AuthFormFooter
          question="Already have an account?"
          actionText="Log in"
          actionHref="/login"
        />
      </Form>
    </>
  );
};

export default SignUpForm;
