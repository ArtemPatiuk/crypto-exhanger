import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Modal, Space, Tag, Typography, Card, Col, Row, Statistic } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { useGetAllAssetsQuery, useGetCountAssetsQuery } from '../../../../app/services/assets';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../../../paths';
import { AddAssetModal } from '../../../../components/modals/add-assets-modal/AddAssetModal';
import { ProfileAssetModal } from '../../../../components/modals/profile-assets-modal/ProfileAssetModal';


interface ListAssets {
  id: string;
  symbol: string;
  name: string;
  imageUrl?: string;
  network: string;
  networkSignature: string;
  address: string;
  isActive: boolean;
}

const columns: ColumnsType<ListAssets> = [
  {
    title: "Актив",
    key: "asset",
    render: (_, record) => (
      <Space>
        <img
          src={record.imageUrl}
          alt={record.symbol}
          style={{ width: 26, height: 26 }}
        />
        <div>
          <div style={{ fontWeight: 600 }}>{record.symbol}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            {record.name}
          </div>
        </div>
      </Space>
    ),
  },

  {
    title: "Мережа",
    dataIndex: "network",
    key: "network",
    render: (network, record) => (
      <Space>
        <Tag color="blue">{record.networkSignature}</Tag>
        {network}
      </Space>
    ),
  },

  {
    title: "Адреса",
    dataIndex: "address",
    key: "address",
    render: (address) => (
      <Typography.Text copyable>
        {address.slice(0, 10)}...{address.slice(-6)}
      </Typography.Text>
    ),
  },

  {
    title: "Статус",
    dataIndex: "isActive",
    key: "isActive",
    render: (isActive: boolean) => (
      <Tag color={isActive ? "green" : "red"}>
        {isActive ? "Активний" : "Вимкнений"}
      </Tag>
    )
  }
];
export const ListAssets = () => {
  const [isModalOpenCreateAssets, setIsModalOpenCreateAssets] = useState(false);
  const [isModalOpenProfileAssets, setIsModalOpenProfileAssets] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  const { data, isLoading } = useGetAllAssetsQuery();
  const { data: stats, isLoading: isLoadingCount } = useGetCountAssetsQuery();

  const assets = data?.flatMap((coin) =>
    coin.networks.map((network) => ({
      id: network.id,

      symbol: coin.symbol,
      name: coin.name,
      imageUrl: coin.imageUrl,

      network: network.name,
      networkSignature: network.networkSignature,

      address: network.depositAddress,
      isActive: network.isActive,
    }))
  ) || [];

  return (
    <div style={{ minHeight: "67vh" }}>
      <AddAssetModal open={isModalOpenCreateAssets} onClose={() => setIsModalOpenCreateAssets(false)} />
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card
            className="asset-card "
            onClick={() => setIsModalOpenCreateAssets(true)}
            hoverable
          >
            <PlusSquareOutlined style={{ fontSize: 40 }} />
            <div>Додати актив</div>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="asset-card">
            <Statistic
              title="Активні активи"
              value={stats?.activeAssets ?? 0}
              loading={isLoadingCount}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="asset-card">
            <Statistic
              title="Всього активів"
              value={stats?.allAssets ?? 0}
            />
          </Card>
        </Col>
      </Row>
      <ProfileAssetModal open={isModalOpenProfileAssets} onClose={() => setIsModalOpenProfileAssets(false)} id={selectedAssetId} />
      <Table
        columns={columns}
        dataSource={assets}
        rowKey="id"
        bordered
        loading={isLoading}
        pagination={false}
        onRow={(record) => {
          return {
            onClick: () => {
              setIsModalOpenProfileAssets(true)
              setSelectedAssetId(record.id)
            }
          }
        }}
      />
    </div>
  )
}
