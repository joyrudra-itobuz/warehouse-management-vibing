"use client";

import {
  Col,
  Descriptions,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Skeleton,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

import AccentSkeletonThemeProvider from "@/components/common/accent-skeleton-theme-provider/accent-skeleton-theme-provider";
import type {
  InventoryProductDetails,
  ProductVariant,
} from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

const { TextArea } = Input;
const { Text } = Typography;

export type InventoryProductFormValues = {
  name: string;
  category: string;
  description?: string;
  isArchived?: boolean;
};

type InventoryProductDetailsModalProps = {
  open: boolean;
  onClose: VoidFunction;
  loading?: boolean;
  submitting?: boolean;
  product: InventoryProductDetails | null;
  variants: ProductVariant[];
  variantsLoading: boolean;
  onSubmit: (values: InventoryProductFormValues) => void;
};

function formatAttributes(attributes: Record<string, unknown>): string {
  return Object.entries(attributes)
    .map(function mapEntry([key, value]) {
      return `${key}: ${String(value)}`;
    })
    .join(", ");
}

const variantColumns: ColumnsType<ProductVariant> = [
  {
    title: "Attributes",
    key: "attributes",
    render: function renderAttributes(_: unknown, record: ProductVariant) {
      const entries = Object.entries(record.attributes);

      if (entries.length === 0) {
        return <Text type="secondary">—</Text>;
      }

      return (
        <Space size={4} wrap>
          {entries.map(function mapAttr([key, value]) {
            return (
              <Tooltip key={key} title={key}>
                <Tag style={{ cursor: "default" }}>{String(value)}</Tag>
              </Tooltip>
            );
          })}
        </Space>
      );
    },
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
    render: function renderSku(value: string | undefined) {
      return value ? (
        <Text code style={{ fontSize: 12 }}>
          {value}
        </Text>
      ) : (
        <Text type="secondary">—</Text>
      );
    },
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: function renderPrice(value: number) {
      return `$${value.toLocaleString()}`;
    },
  },
  {
    title: "Markup",
    dataIndex: "markup",
    key: "markup",
    render: function renderMarkup(value: number) {
      return value ? `${value}%` : "—";
    },
  },
  {
    title: "Images",
    key: "images",
    render: function renderImages(_: unknown, record: ProductVariant) {
      if (!record.productImage || record.productImage.length === 0) {
        return <Text type="secondary">—</Text>;
      }

      return (
        <Image.PreviewGroup>
          <Space size={6}>
            {record.productImage.slice(0, 3).map(function mapImg(img, idx) {
              return (
                <Image
                  key={`${record.id}-img-${idx}`}
                  src={img}
                  width={40}
                  height={40}
                  style={{ borderRadius: 6, objectFit: "cover" }}
                  alt={`Variant image ${idx + 1}`}
                />
              );
            })}
            {record.productImage.length > 3 && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                +{record.productImage.length - 3}
              </Text>
            )}
          </Space>
        </Image.PreviewGroup>
      );
    },
  },
];

export default function InventoryProductDetailsModal({
  open,
  onClose,
  loading,
  submitting,
  product,
  variants,
  variantsLoading,
  onSubmit,
}: InventoryProductDetailsModalProps) {
  const [form] = Form.useForm<InventoryProductFormValues>();
  const [tabKey, setTabKey] = useState("preview");

  useEffect(
    function syncFormValues() {
      if (!open || !product) {
        return;
      }

      form.setFieldsValue({
        name: product.name,
        category: product.category,
        description: product.description,
        isArchived: product.isArchived,
      });
    },
    [form, open, product],
  );

  const loadingSkeleton = (
    <AccentSkeletonThemeProvider>
      <Space orientation="vertical" size={14} style={{ width: "100%" }}>
        <Row gutter={[16, 16]} align="top">
          <Col xs={24} md={14}>
            <Space orientation="vertical" size={10} style={{ width: "100%" }}>
              <Skeleton.Input active size="small" style={{ width: 180 }} />
              <Skeleton.Input active block style={{ height: 36 }} />
              <Skeleton.Input active block style={{ height: 36 }} />
              <Skeleton.Input active block style={{ height: 36 }} />
              <Skeleton.Input active block style={{ height: 36 }} />
              <Skeleton.Input active block style={{ height: 36 }} />
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <Space orientation="vertical" size={10} style={{ width: "100%" }}>
              <Skeleton.Input active block style={{ height: 120 }} />
              <Skeleton.Input active block style={{ height: 120 }} />
            </Space>
          </Col>
        </Row>
      </Space>
    </AccentSkeletonThemeProvider>
  );

  return (
    <Modal
      open={open}
      onCancel={function onCancel() {
        setTabKey("preview");
        onClose();
      }}
      title={product?.name ?? "Product Details"}
      okText="Save"
      onOk={function onOkClick() {
        form.submit();
      }}
      okButtonProps={{
        style: { display: tabKey === "edit" ? "inline-flex" : "none" },
      }}
      width={900}
      destroyOnHidden
      confirmLoading={submitting}
    >
      {loading && !product ? (
        loadingSkeleton
      ) : !product ? (
        <Empty description="No product details available" />
      ) : (
        <Form<InventoryProductFormValues>
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          disabled={loading || submitting}
        >
          <Tabs
            activeKey={tabKey}
            onChange={setTabKey}
            items={[
              {
                key: "preview",
                label: "Preview",
                children: (
                  <Space
                    orientation="vertical"
                    size={20}
                    style={{ width: "100%" }}
                  >
                    <Row gutter={[16, 16]} align="top">
                      <Col xs={24} md={14}>
                        <Descriptions
                          bordered
                          column={1}
                          size="small"
                          styles={{
                            label: {
                              width: 140,
                            },
                          }}
                        >
                          <Descriptions.Item label="Name">
                            {product.name}
                          </Descriptions.Item>
                          <Descriptions.Item label="Category">
                            <Tag>{product.category}</Tag>
                          </Descriptions.Item>
                          {product.brand ? (
                            <Descriptions.Item label="Brand">
                              {product.brand}
                            </Descriptions.Item>
                          ) : null}
                          {product.label ? (
                            <Descriptions.Item label="Label">
                              {product.label}
                            </Descriptions.Item>
                          ) : null}
                          {product.variantAttributes &&
                          Object.keys(product.variantAttributes).length > 0 ? (
                            <Descriptions.Item label="Variant Attrs">
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {formatAttributes(product.variantAttributes)}
                              </Text>
                            </Descriptions.Item>
                          ) : null}
                          <Descriptions.Item label="Status">
                            <Text
                              type={
                                product.status === "Archived"
                                  ? "warning"
                                  : undefined
                              }
                            >
                              {product.status}
                            </Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Quantity">
                            {product.quantity ?? "—"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Limit">
                            {product.limit ?? "—"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Description">
                            {product.description || "—"}
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>

                    <div>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: 10 }}
                      >
                        Variants
                        {variants.length > 0 && (
                          <Tag style={{ marginLeft: 8 }}>{variants.length}</Tag>
                        )}
                      </Text>
                      {variantsLoading ? (
                        <AccentSkeletonThemeProvider>
                          <Space
                            orientation="vertical"
                            size={8}
                            style={{ width: "100%" }}
                          >
                            {[0, 1, 2].map(function mapSkel(i) {
                              return (
                                <Skeleton.Input
                                  key={i}
                                  active
                                  block
                                  style={{ height: 44 }}
                                />
                              );
                            })}
                          </Space>
                        </AccentSkeletonThemeProvider>
                      ) : variants.length === 0 ? (
                        <Empty
                          description="No variants found"
                          style={{ margin: "12px 0" }}
                        />
                      ) : (
                        <Table<ProductVariant>
                          rowKey="id"
                          columns={variantColumns}
                          dataSource={variants}
                          pagination={false}
                          size="small"
                          scroll={{ x: "max-content" }}
                        />
                      )}
                    </div>
                  </Space>
                ),
              },
              {
                key: "edit",
                label: "Edit",
                children: (
                  <Row gutter={[12, 4]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Product name is required",
                          },
                        ]}
                      >
                        <Input placeholder="Product name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Category"
                        name="category"
                        rules={[
                          {
                            required: true,
                            message: "Category is required",
                          },
                        ]}
                      >
                        <Input placeholder="Category" />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Description" name="description">
                        <TextArea rows={3} placeholder="Product description" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Archived"
                        name="isArchived"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
            ]}
          />
        </Form>
      )}
    </Modal>
  );
}
