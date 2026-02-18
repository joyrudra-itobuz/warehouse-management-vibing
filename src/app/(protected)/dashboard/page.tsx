import { Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function DashboardPage() {
  return (
    <main style={{ padding: 24, minHeight: "100vh" }}>
      <Card bordered={false} style={{ borderRadius: 20 }}>
        <Space direction="vertical" size={8}>
          <Title level={2} style={{ marginBottom: 0 }}>
            Dashboard
          </Title>
          <Text type="secondary">
            You are authenticated and viewing a protected route.
          </Text>
        </Space>
      </Card>
    </main>
  );
}
