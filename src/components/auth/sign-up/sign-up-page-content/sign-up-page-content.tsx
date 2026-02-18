import AuthPageLayout from "@/components/auth/common/auth-page-layout/auth-page-layout";
import SignUpForm from "@/components/auth/sign-up/sign-up-form/sign-up-form";

const SignUpPageContent = () => {
  return (
    <AuthPageLayout
      title="Create your account"
      subtitle="Start by entering your work email and role."
    >
      <SignUpForm />
    </AuthPageLayout>
  );
};

export default SignUpPageContent;
