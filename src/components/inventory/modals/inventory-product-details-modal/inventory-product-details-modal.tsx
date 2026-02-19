"use client";

import {
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Space,
  Switch,
  Typography,
} from "antd";
import { useEffect } from "react";

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
  productImages?: string;
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
        productImages: product.images.join("\n"),
      });
    },
    [form, open, product],
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={product?.name ?? "Product Details"}
      okText="Save"
      onOk={function onOkClick() {
        form.submit();
      }}
      width={760}
      destroyOnClose
      confirmLoading={submitting}
    >
      {!product ? (
        <Empty description="No product details available" />
      ) : (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {product.images.length > 0 ? (
            <Image.PreviewGroup>
              <Space size={12} wrap>
                {product.images.map(function mapImage(image) {
                  return (
                    <Image
                      key={image}
                      src={image}
                      alt={product.name}
                      width={92}
                      height={92}
                      style={{ borderRadius: 12, objectFit: "cover" }}
                    />
                  );
                })}
              </Space>
            </Image.PreviewGroup>
          ) : null}

          <Form<InventoryProductFormValues>
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            disabled={loading || submitting}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Product name is required" }]}
            >
              <Input placeholder="Product name" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Input placeholder="Category" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Price is required" }]}
            >
              <InputNumber<number>
                min={0}
                precision={2}
                style={{ width: "100%" }}
                placeholder="Price"
              />
            </Form.Item>

            <Form.Item label="Markup (%)" name="markup">
              <InputNumber<number>
                min={0}
                max={100}
                precision={2}
                style={{ width: "100%" }}
                placeholder="Markup"
              />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea rows={3} placeholder="Description" />
            </Form.Item>

            <Form.Item
              label="Product Images (one URL per line)"
              name="productImages"
            >
              <TextArea rows={3} placeholder="https://..." />
            </Form.Item>

            <Form.Item
              label="Archived"
              name="isArchived"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Space size={24}>
              <Text type="secondary">
                Current quantity: {product.quantity ?? "-"}
              </Text>
              <Text type="secondary">Limit: {product.limit ?? "-"}</Text>
              <Text
                type={product.status === "Archived" ? "warning" : undefined}
              >
                Status: {product.status}
              </Text>
            </Space>
          </Form>
        </Space>
      )}
    </Modal>
  );
}
