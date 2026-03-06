"use client";

import { Card, Col, Layout, Row, Space, Typography } from "antd";
import type { ReactNode } from "react";

const { Content } = Layout;
const { Title, Text } = Typography;

type AuthPageLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const AuthPageLayout = ({ title, subtitle, children }: AuthPageLayoutProps) => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#F5F6F8" }}>
      <Content style={{ padding: 24 }}>
        <Row gutter={24} style={{ minHeight: "calc(100vh - 48px)" }}>
          <Col xs={0} lg={11}>
            <Card
              className="flex items-center justify-center"
              style={{
                height: "100%",
                borderRadius: 24,
                background: "#14161F",
                color: "#FFFFFF",
                overflow: "hidden",
              }}
            >
              <Space orientation="vertical" size={16}>
                <Text
                  style={{
                    color: "#D6F247",
                    fontWeight: 700,
                    letterSpacing: 0.3,
                  }}
                >
                  Vault
                </Text>
                <Title level={2} style={{ color: "#FFFFFF", marginBottom: 0 }}>
                  Warehouse Operations
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.72)", fontSize: 16 }}>
                  Manage inventory, shipments, and users from one dashboard.
                </Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={13}>
            <Card
              variant="borderless"
              style={{ height: "100%", borderRadius: 24 }}
              bodyStyle={{
                minHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 28px",
              }}
            >
              <div style={{ width: "100%", maxWidth: 420 }}>
                <Space
                  orientation="vertical"
                  size={8}
                  style={{ marginBottom: 24 }}
                >
                  <Title level={2} style={{ marginBottom: 0 }}>
                    {title}
                  </Title>
                  <Text type="secondary">{subtitle}</Text>
                </Space>
                {children}
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AuthPageLayout;
