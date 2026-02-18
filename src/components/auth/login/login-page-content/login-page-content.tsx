import AuthPageLayout from "@/components/auth/common/auth-page-layout/auth-page-layout";
import LoginForm from "@/components/auth/login/login-form/login-form";

const LoginPageContent = () => {
  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue managing your warehouse operations."
    >
      <LoginForm />
    </AuthPageLayout>
  );
};

export default LoginPageContent;
