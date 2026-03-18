import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Modal, Space, Tag, Typography, Card, Col, Row, Statistic } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { useGetAllAssetsQuery, useGetCountAssetsQuery, useGetListAvailableCoinQuery, useGetAssetFiltersQuery } from '../../../../app/services/assets';
import type { ColumnsType } from 'antd/es/table';
import { AddAssetModal } from '../../../../components/modals/add-assets-modal/AddAssetModal';
import { ProfileAssetModal } from '../../../../components/modals/profile-assets-modal/ProfileAssetModal';
import { AssetFilters, IAsset } from '../../../../app/types';
import { Pagination } from '../../../../app/types/pagination';


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


export const ListAssets = () => {
  const [isModalOpenCreateAssets, setIsModalOpenCreateAssets] = useState(false);
  const [isModalOpenProfileAssets, setIsModalOpenProfileAssets] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
  });
  const [assetFilters, setAssetFilters] = useState<AssetFilters>({
    coins: undefined,
    networks: undefined,
    isActive: undefined,
  });

  const { data: assetsResponse, isLoading } = useGetAllAssetsQuery({
    pagination,
    filters: assetFilters,
  });
  const { data: filtersData } = useGetAssetFiltersQuery();
  const { data: stats, isLoading: isLoadingCount } = useGetCountAssetsQuery();

  const assets = assetsResponse?.data || [];

  const coinFilters = filtersData?.coins.map((c) => ({
    text: c.label,
    value: c.value,
  })) || [];

  const networkFilters = filtersData?.networks.map((n) => ({
    text: n.label,
    value: n.value,
  })) || [];
  const columns: ColumnsType<IAsset> = [
    {
      title: "Актив",
      key: "coins", 
      dataIndex: "symbol",
      filters: coinFilters,
      filteredValue: assetFilters.coins || null,
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
      filteredValue: assetFilters.networks || null,
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
      filters: [
        { text: "Активний", value: true },
        { text: "Вимкнений", value: false },
      ],
      filteredValue: assetFilters.isActive !== undefined ? [assetFilters.isActive] : null,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Активний" : "Вимкнений"}
        </Tag>
      ),
    },
  ];
  const handleTableChange = (pagination: any, tableFilters: any) => {
    setPagination({
      page: pagination.current,
      limit: pagination.pageSize,
    });

    setAssetFilters({
      coins: tableFilters.coins?.length ? tableFilters.coins : undefined,
      networks: tableFilters.networks?.length ? tableFilters.networks : undefined,
      isActive: tableFilters.isActive?.length !== undefined ? tableFilters.isActive[0] : undefined,
    });
  };
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
        onRow={(record) => ({
          onClick: () => {
            setSelectedAssetId(record.id);
            setIsModalOpenProfileAssets(true);
          }
        })}
        pagination={{
          total: assetsResponse?.meta.total,
          current: pagination.page,
          pageSize: pagination.limit,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  )
}
