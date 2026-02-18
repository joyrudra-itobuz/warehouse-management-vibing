"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Space, Typography } from "antd";

import useAppMutation from "@/hooks/common/use-app-mutation/use-app-mutation";
import { authRoutes } from "@/lib/apis/routes";
import type {
  ForgotPasswordDto,
  SendOtpDto,
} from "@/lib/apis/swagger/auth-types";
import type {
  ForgotPasswordResponse,
  SendOtpResponse,
} from "@/types/apis/auth/auth-response-types/auth-response-types";

const OTP_LENGTH = 6;

type ForgotPasswordFormValues = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

export default function ForgotPasswordForm() {
  const [form] = Form.useForm<ForgotPasswordFormValues>();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const router = useRouter();

  const sendOtpMutation = useAppMutation<SendOtpResponse, Error, SendOtpDto>({
    mutationKey: ["auth", "send-otp"],
    mutationFn: authRoutes.sendOtp,
    options: {
      successMessage: "OTP sent to your email.",
      errorMessage: "Unable to send OTP right now.",
    },
  });

  const forgotPasswordMutation = useAppMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordDto
  >({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: authRoutes.forgotPassword,
    options: {
      successMessage: "Password reset successful. Please login.",
      errorMessage: "Unable to reset password right now.",
    },
  });

  async function handleSendOtp() {
    const values = await form.validateFields(["email"]);
    const email = values.email.trim();

    await sendOtpMutation.mutateAsync({ email });

    setEmailForReset(email);
    setIsOtpSent(true);
  }

  async function handleResetPassword(values: ForgotPasswordFormValues) {
    const payload: ForgotPasswordDto = {
      email: emailForReset || values.email.trim(),
      otp: values.otp,
      password: values.password,
    };

    await forgotPasswordMutation.mutateAsync(payload);
    router.push("/login");
  }

  return (
    <Form<ForgotPasswordFormValues>
      form={form}
      layout="vertical"
      onFinish={handleResetPassword}
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
        <Input
          size="large"
          placeholder="you@company.com"
          disabled={isOtpSent}
        />
      </Form.Item>

      {!isOtpSent ? (
        <Form.Item style={{ marginTop: 8, marginBottom: 12 }}>
          <Button
            type="primary"
            size="large"
            block
            loading={sendOtpMutation.isPending}
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>
        </Form.Item>
      ) : null}

      {isOtpSent ? (
        <>
          <Form.Item
            label="OTP"
            name="otp"
            rules={[
              { required: true, message: "Please enter the OTP." },
              {
                len: OTP_LENGTH,
                message: `OTP must be ${OTP_LENGTH} digits.`,
              },
            ]}
          >
            <Input.OTP
              length={OTP_LENGTH}
              size="large"
              formatter={(value) => value.replace(/\D/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="New password"
            name="password"
            rules={[
              { required: true, message: "Please enter a new password." },
              {
                min: 8,
                message: "Password must be at least 8 characters.",
              },
            ]}
          >
            <Input.Password size="large" placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Passwords do not match."));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item style={{ marginTop: 8, marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={forgotPasswordMutation.isPending}
            >
              Reset Password
            </Button>
          </Form.Item>
        </>
      ) : null}

      <Space>
        <Typography.Text type="secondary">
          Remembered your password?
        </Typography.Text>
        <Link href="/login">Back to login</Link>
      </Space>
    </Form>
  );
}
