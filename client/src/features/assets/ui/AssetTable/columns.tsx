import React from 'react';
import { Space, Tag, Typography, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IAsset, AssetFilters } from '../../../../app/types';

export const getAssetColumns = (
  coinFilters: { text: string; value: string | number | boolean }[],
  networkFilters: { text: string; value: string | number | boolean }[],
  currentFilters: AssetFilters
): ColumnsType<IAsset> => [
    {
      title: "Актив",
      key: "coins",
      dataIndex: "symbol",
      filters: coinFilters,
      filteredValue: currentFilters.coins || null,
      render: (_, record) => (
        <Space>
          <img src={record.imageUrl} alt={record.symbol} style={{ width: 26 }} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.symbol}</div>
            <div style={{ fontSize: 12 }}>{record.name}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Мережа",
      dataIndex: "network",
      key: "networks",
      filters: networkFilters,
      filteredValue: currentFilters.networks || null,
      render: (network, record) => (
        <Space>
          <Tag color="rgba(0, 255, 160, 0.4)">{record.networkSignature}</Tag>
          {network}
        </Space>
      ),
    },
    {
      title: "Адреса",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Tooltip title={address}>
          <Typography.Text copyable={{ text: address }}>
            {address.slice(0, 10)}...{address.slice(-6)}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Статус",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        { text: "Активний", value: true },
        { text: "Вимкнений", value: false },
      ],
      filteredValue: currentFilters.isActive !== undefined ? [currentFilters.isActive] : null,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Активний" : "Вимкнений"}
        </Tag>
      ),
    },
  ];