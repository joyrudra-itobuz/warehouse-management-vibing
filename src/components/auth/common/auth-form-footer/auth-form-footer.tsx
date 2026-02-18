import Link from "next/link";
import { Space, Typography } from "antd";

const { Text } = Typography;

type AuthFormFooterProps = {
  question: string;
  actionText: string;
  actionHref: string;
};

const AuthFormFooter = ({
  question,
  actionText,
  actionHref,
}: AuthFormFooterProps) => {
  return (
    <Space>
      <Text type="secondary">{question}</Text>
      <Link href={actionHref}>{actionText}</Link>
    </Space>
  );
};

export default AuthFormFooter;
