"use client";

import { FilterOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Select, Space, Typography } from "antd";
import dayjs from "dayjs";

import type { TransactionTypeOption } from "@/types/apis/transactions/transaction-response-types/transaction-response-types";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

type TransactionsTopbarProps = {
  typeValue?: string;
  statusValue?: string;
  startDate?: string;
  endDate?: string;
  availableStatuses: string[];
  onChangeType: (value?: string) => void;
  onChangeStatus: (value?: string) => void;
  onChangeDateRange: (startDate?: string, endDate?: string) => void;
  onResetFilters: VoidFunction;
};

const transactionTypeOptions: {
  value: TransactionTypeOption;
  label: string;
}[] = [
  { value: "IN", label: "IN" },
  { value: "OUT", label: "OUT" },
  { value: "TRANSFER", label: "TRANSFER" },
  { value: "ADJUSTMENT", label: "ADJUSTMENT" },
];

export default function TransactionsTopbar({
  typeValue,
  statusValue,
  startDate,
  endDate,
  availableStatuses,
  onChangeType,
  onChangeStatus,
  onChangeDateRange,
  onResetFilters,
}: TransactionsTopbarProps) {
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ marginBottom: 18, gap: 16, flexWrap: "wrap" }}
    >
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Transactions
        </Title>
        <Text type="secondary">
          Dynamic transaction tracking by type, status, and date range.
        </Text>
      </div>

      <Space size={10} wrap>
        <Select
          allowClear
          value={typeValue}
          placeholder="Type"
          style={{ width: 140 }}
          options={transactionTypeOptions}
          onChange={onChangeType}
        />
        <Select
          allowClear
          value={statusValue}
          placeholder="Status"
          style={{ width: 170 }}
          options={availableStatuses.map(function mapStatus(status) {
            return {
              value: status,
              label: status,
            };
          })}
          onChange={onChangeStatus}
        />
        <RangePicker
          value={
            startDate && endDate
              ? [dayjs(startDate, "YYYY-MM-DD"), dayjs(endDate, "YYYY-MM-DD")]
              : null
          }
          format="YYYY-MM-DD"
          placeholder={["Start date", "End date"]}
          onChange={function onChangeDate(_, dateStrings) {
            const [start, end] = dateStrings;
            onChangeDateRange(start || undefined, end || undefined);
          }}
        />
        <Button icon={<FilterOutlined />} onClick={onResetFilters}>
          Reset
        </Button>
      </Space>
    </Flex>
  );
}
