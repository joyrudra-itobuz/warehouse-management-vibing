"use client";

import { Table, Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { TableBlock } from "@/types/apis/chat/chat-types/chat-types";

type ChatTableBlockProps = {
  data: TableBlock;
};

const { Text } = Typography;

export default function ChatTableBlock({ data }: ChatTableBlockProps) {
  const antColumns: ColumnType<Record<string, unknown>>[] = data.columns.map(
    function mapColumn(col) {
      return {
        key: col.key,
        dataIndex: col.key,
        title: col.label,
        ellipsis: true,
        render: function renderCell(value: unknown) {
          return (
            <Text style={{ fontSize: 12 }}>
              {value == null ? "—" : String(value)}
            </Text>
          );
        },
      };
    },
  );

  const dataSource = data.rows.map(function mapRow(row, index) {
    return { key: index, ...row };
  });

  return (
    <div style={{ marginTop: 4 }}>
      {data.title ? (
        <Text
          strong
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
          }}
        >
          {data.title}
        </Text>
      ) : null}
      <Table<Record<string, unknown>>
        columns={antColumns}
        dataSource={dataSource}
        size="small"
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ fontSize: 12 }}
      />
    </div>
  );
}
