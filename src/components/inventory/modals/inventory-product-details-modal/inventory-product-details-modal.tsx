"use client";

import {
  Descriptions,
  Empty,
  Image,
  Modal,
  Space,
  Tag,
  Typography,
} from "antd";

import type { InventoryProductDetails } from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

const { Text } = Typography;

type InventoryProductDetailsModalProps = {
  open: boolean;
  onClose: VoidFunction;
  loading: boolean;
  product: InventoryProductDetails | null;
};

export default function InventoryProductDetailsModal({
  open,
  onClose,
  loading,
  product,
}: InventoryProductDetailsModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={product?.name ?? "Product Details"}
      footer={null}
      width={760}
      destroyOnClose
      confirmLoading={loading}
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

          <Descriptions
            bordered
            column={2}
            size="small"
            labelStyle={{ width: 140 }}
          >
            <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
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
                type={product.status === "Archived" ? "warning" : undefined}
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
            <Descriptions.Item label="Description" span={2}>
              {product.description || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      )}
    </Modal>
  );
}
