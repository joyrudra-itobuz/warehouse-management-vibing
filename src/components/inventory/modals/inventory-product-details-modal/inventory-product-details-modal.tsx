"use client";

import {
  Col,
  Descriptions,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Skeleton,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";

import AccentSkeletonThemeProvider from "@/components/common/accent-skeleton-theme-provider/accent-skeleton-theme-provider";
import type { InventoryProductDetails } from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

const { TextArea } = Input;
const { Text } = Typography;

export type InventoryProductFormValues = {
  name: string;
  category: string;
  description?: string;
  price: number;
  markup?: number;
  isArchived?: boolean;
  productImages?: UploadFile[];
};

type InventoryProductDetailsModalProps = {
  open: boolean;
  onClose: VoidFunction;
  loading?: boolean;
  submitting?: boolean;
  product: InventoryProductDetails | null;
  onSubmit: (values: InventoryProductFormValues) => void;
};

export default function InventoryProductDetailsModal({
  open,
  onClose,
  loading,
  submitting,
  product,
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
        price: product.price,
        markup: product.markup,
        isArchived: product.isArchived,
        productImages: product.images.map(function mapImage(image, index) {
          return {
            uid: `existing-${index}`,
            name: `image-${index + 1}`,
            status: "done",
            url: image,
          } as UploadFile;
        }),
      });
    },
    [form, open, product],
  );

  const normFile = function normFile(event: { fileList?: UploadFile[] }) {
    return event?.fileList ?? [];
  };

  const loadingSkeleton = (
    <AccentSkeletonThemeProvider>
      <Space direction="vertical" size={14} style={{ width: "100%" }}>
        <Skeleton.Input active size="small" style={{ width: 140 }} />
        <Skeleton active title={false} paragraph={{ rows: 8 }} />
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Skeleton.Input active block />
          </Col>
          <Col xs={24} md={12}>
            <Skeleton.Input active block />
          </Col>
          <Col xs={24}>
            <Skeleton.Image active style={{ width: "100%", height: 140 }} />
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
      width={860}
      destroyOnClose
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
                  <Row gutter={[16, 16]} align="top">
                    <Col xs={24} md={14}>
                      <Descriptions
                        bordered
                        column={1}
                        size="small"
                        labelStyle={{ width: 140 }}
                      >
                        <Descriptions.Item label="Name">
                          {product.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Category">
                          <Tag>{product.category}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Price">
                          ${product.price.toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Markup">
                          {product.markup}%
                        </Descriptions.Item>
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
                          {product.quantity ?? "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Limit">
                          {product.limit ?? "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                          {product.description || "-"}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col xs={24} md={10}>
                      {product.images.length > 0 ? (
                        <Image.PreviewGroup>
                          <Space
                            direction="vertical"
                            size={10}
                            style={{ width: "100%" }}
                          >
                            {product.images.map(function mapImage(image) {
                              return (
                                <Image
                                  key={image}
                                  src={image}
                                  alt={product.name}
                                  width="100%"
                                  style={{
                                    borderRadius: 12,
                                    objectFit: "cover",
                                  }}
                                />
                              );
                            })}
                          </Space>
                        </Image.PreviewGroup>
                      ) : (
                        <Empty description="No product image" />
                      )}
                    </Col>
                  </Row>
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
                          { required: true, message: "Category is required" },
                        ]}
                      >
                        <Input placeholder="Category" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                          { required: true, message: "Price is required" },
                        ]}
                      >
                        <InputNumber<number>
                          min={0}
                          precision={2}
                          style={{ width: "100%" }}
                          placeholder="Price"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Markup (%)" name="markup">
                        <InputNumber<number>
                          min={0}
                          max={100}
                          precision={2}
                          style={{ width: "100%" }}
                          placeholder="Markup"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item label="Description" name="description">
                        <TextArea rows={3} placeholder="Description" />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        label="Product Images"
                        name="productImages"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Upload multiple product images"
                      >
                        <Upload
                          listType="picture-card"
                          multiple
                          beforeUpload={function blockAutoUpload() {
                            return false;
                          }}
                        >
                          + Upload
                        </Upload>
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

                    <Col xs={24} md={12}>
                      <Space size={16} wrap>
                        <Text type="secondary">
                          Qty: {product.quantity ?? "-"}
                        </Text>
                        <Text type="secondary">
                          Limit: {product.limit ?? "-"}
                        </Text>
                      </Space>
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
