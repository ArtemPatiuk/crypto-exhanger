import React, { useEffect } from 'react';
import { Button, Table, notification } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { useGetAllAssetsQuery } from '../../../../app/services/assets';
import type { ColumnsType } from 'antd/es/table';
import { IAsset } from '../../../../app/types/asset';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../../../paths';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';


const colums: ColumnsType<IAsset> = [
  {
    title: "Ім'я",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <>
        {record.imageUrl && (
          <img
            src={record.imageUrl}
            alt={record.coin}
            style={{ width: "20px", height: "20px", marginRight: "10px" }}
          />
        )}
        {text}
      </>
    ),
  },
  {
    title: "Мережа",
    dataIndex: "network",
    key: "network",
  },
  {
    title: "Підпис мережі",
    dataIndex: "networkSignature",
    key: "networkSignature",
  },
  {
    title: "Адреса для отримання",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Мін.сумм.вводу",
    dataIndex: "depositDust",
    key: "depositDust",
    render: (text) => parseFloat(text).toFixed(8)
  },
  {
    title: "Мін.сумм.виводу",
    dataIndex: "withdrawMin",
    key: "withdrawMin",
  },
  {
    title: "Комісія мережі",
    dataIndex: "withdrawFee",
    key: "withdrawFee",
  },
]
export const ListAssets = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllAssetsQuery();
  const user = useSelector(selectUser);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const successDeleteMessageAssets = localStorage.getItem('deleteSuccessAssets');
    const successEditMessageAssets = localStorage.getItem('editSuccessAssets');
    const successCreateMessageAssets = localStorage.getItem('createSuccessAssets');
    if (successDeleteMessageAssets) {
      api.success({
        message: 'Вітаю!',
        description: successDeleteMessageAssets,
      });
      localStorage.removeItem('deleteSuccessAssets');
    }
    if (successEditMessageAssets) {
      api.success({
        message: 'Вітаю!',
        description: successEditMessageAssets,
      });
      localStorage.removeItem('editSuccessAssets');
    }
    if (successCreateMessageAssets) {
      api.success({
        message: 'Вітаю!',
        description: successCreateMessageAssets,
      });
      localStorage.removeItem('createSuccessAssets');
    }
  }, [api]);
  useEffect(() => {
    if (!user || !user?.role?.includes("ADMIN")) {
      navigate(Paths.home)
    }
  }, [])

  const goToAddAsset = () => {
    navigate(Paths.assetsAdd)
  }
  return (
    <div style={{ minHeight: "67vh" }}>
      {contextHolder}
      <Button type='primary' onClick={goToAddAsset} icon={<PlusSquareOutlined />}>
        Додати актив
      </Button>
      <Table
        bordered
        loading={isLoading}
        dataSource={data}
        pagination={false}
        columns={colums}
        rowKey={(record) => record.id}
        onRow={(record) => {
          return {
            onClick: () => navigate(`${Paths.assetProfile}/${record.id}`)
          }
        }}
      />
    </div>
  )
}
