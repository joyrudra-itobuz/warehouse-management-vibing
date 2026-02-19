"use client";

import { Button, Form, Input, Select } from "antd";

import AuthFormFooter from "@/components/auth/common/auth-form-footer/auth-form-footer";
import useAppMutation from "@/hooks/common/use-app-mutation/use-app-mutation";
import { authRoutes } from "@/lib/apis/routes";
import type { AuthRole, SignupDto } from "@/lib/apis/swagger/auth-types";
import type { SignupResponse } from "@/types/apis/auth/auth-response-types/auth-response-types";

const roleOptions: { label: string; value: AuthRole }[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Staff", value: "STAFF" },
];

const SignUpForm = () => {
  const signUpMutation = useAppMutation<SignupResponse, Error, SignupDto>({
    mutationKey: ["auth", "signup"],
    mutationFn: authRoutes.signup,
    options: {
      successMessage:
        "Signup request submitted. Please verify from your email.",
      errorMessage: "Unable to submit signup request right now.",
    },
  });

  const onFinish = async (values: SignupDto) => {
    try {
      await signUpMutation.mutateAsync(values);
    } catch {
      return;
    }
  };

  return (
    <Form<SignupDto> layout="vertical" onFinish={onFinish} requiredMark={false}>
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
          loading={signUpMutation.isPending}
          block
        >
          Create account
        </Button>
      </Form.Item>

      <AuthFormFooter
        question="Already have an account?"
        actionText="Log in"
        actionHref="/auth/login"
      />
    </Form>
  );
};

export default SignUpForm;
