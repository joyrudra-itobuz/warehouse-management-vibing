import AuthPageLayout from "@/components/auth/common/auth-page-layout/auth-page-layout";
import ForgotPasswordForm from "@/components/auth/forgot-password/forgot-password-form/forgot-password-form";

export default function ForgotPasswordPageContent() {
  return (
    <AuthPageLayout
      title="Reset your password"
      subtitle="Send OTP to your email, then enter the OTP and your new password."
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
