"use client";

import { useRouter } from "next/navigation";
import { Button, Form, Input } from "antd";

import AuthFormFooter from "@/components/auth/common/auth-form-footer/auth-form-footer";
import useAppMutation from "@/hooks/common/use-app-mutation/use-app-mutation";
import { authRoutes } from "@/lib/apis/routes";
import type { LoginDto } from "@/lib/apis/swagger/auth-types";
import type { LoginResponse } from "@/types/apis/auth/auth-response-types/auth-response-types";

const LoginForm = () => {
  const loginMutation = useAppMutation<LoginResponse, Error, LoginDto>({
    mutationKey: ["auth", "login"],
    mutationFn: authRoutes.login,
    options: {
      successMessage: "Login successful.",
      errorMessage: "Unable to login right now.",
    },
  });

  const router = useRouter();

  const onFinish = async (values: LoginDto) => {
    try {
      await loginMutation.mutateAsync(values);
      router.push("/");
    } catch {
      return;
    }
  };

  return (
    <Form<LoginDto> layout="vertical" onFinish={onFinish} requiredMark={false}>
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
          loading={loginMutation.isPending}
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
  );
};

export default LoginForm;
