"use client";

import {
  Descriptions,
  Image,
  Modal,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";

import AccentSkeletonThemeProvider from "@/components/common/accent-skeleton-theme-provider/accent-skeleton-theme-provider";
import type { TransactionDetails } from "@/types/apis/transactions/transaction-response-types/transaction-response-types";

const { Text } = Typography;

type TransactionDetailsModalProps = {
  open: boolean;
  onClose: VoidFunction;
  transaction: TransactionDetails | null;
  loading?: boolean;
};

function renderValue(value: string | number) {
  if (value === "" || value === "-") {
    return "-";
  }

  return value;
}

export default function TransactionDetailsModal({
  open,
  onClose,
  transaction,
  loading,
}: TransactionDetailsModalProps) {
  const loadingSkeleton = (
    <AccentSkeletonThemeProvider>
      <Space direction="vertical" size={14} style={{ width: "100%" }}>
        <Skeleton active title={false} paragraph={{ rows: 2 }} />
        <Skeleton.Image active style={{ width: 92, height: 92 }} />
        <Skeleton active title={false} paragraph={{ rows: 10 }} />
      </Space>
    </AccentSkeletonThemeProvider>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Transaction Details"
      width={860}
      destroyOnClose
    >
      {loading || !transaction ? (
        loadingSkeleton
      ) : (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {transaction.productImages.length > 0 ? (
            <Image.PreviewGroup>
              <Space size={12} wrap>
                {transaction.productImages.map(function mapImage(image) {
                  return (
                    <Image
                      key={image}
                      src={image}
                      alt={transaction.productName}
                      width={92}
                      height={92}
                      style={{ borderRadius: 10, objectFit: "cover" }}
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
            <Descriptions.Item label="Type">
              <Tag>{transaction.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag>{transaction.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {renderValue(transaction.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {transaction.quantity}
            </Descriptions.Item>

            <Descriptions.Item label="Product">
              {renderValue(transaction.productName)}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {renderValue(transaction.productCategory)}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              ${transaction.productPrice.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {renderValue(transaction.productDescription)}
            </Descriptions.Item>

            <Descriptions.Item label="Source Warehouse">
              {renderValue(transaction.sourceWarehouse)}
            </Descriptions.Item>
            <Descriptions.Item label="Destination Warehouse">
              {renderValue(transaction.destinationWarehouse)}
            </Descriptions.Item>

            <Descriptions.Item label="Customer Name">
              {renderValue(transaction.customerName)}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Email">
              {renderValue(transaction.customerEmail)}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Phone">
              {renderValue(transaction.customerPhone)}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Address">
              {renderValue(transaction.customerAddress)}
            </Descriptions.Item>

            <Descriptions.Item label="Supplier">
              {renderValue(transaction.supplier)}
            </Descriptions.Item>
            <Descriptions.Item label="Reason">
              {renderValue(transaction.reason)}
            </Descriptions.Item>

            <Descriptions.Item label="Performed By">
              {renderValue(transaction.performedByName)}
            </Descriptions.Item>
            <Descriptions.Item label="Performer Email">
              {renderValue(transaction.performedByEmail)}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              {renderValue(transaction.performedByRole)}
            </Descriptions.Item>
            <Descriptions.Item label="Notes" span={2}>
              <Text>{renderValue(transaction.notes)}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Space>
      )}
    </Modal>
  );
}
