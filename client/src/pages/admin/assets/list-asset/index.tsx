import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Modal } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { useAddAssetMutation, useGetAllAssetsQuery, useGetListAvailableCoinQuery, useGetListAvailableNetworkQuery } from '../../../../app/services/assets';
import type { ColumnsType } from 'antd/es/table';
import { ICoin } from '../../../../app/types/asset';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../../../paths';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { AssetForm } from '../../../../components/forms/form-asset';
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';
import { AddAssetModal } from '../../../../components/modals/add-assets-modal/AddAssetModal';



const colums: ColumnsType<ICoin> = [
  {
    title: "Ім'я",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <>
        {record.imageUrl && (
          <img
            src={record.imageUrl}
            alt={record.symbol}
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetAllAssetsQuery();

  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "67vh" }}>
      <Button type='primary' onClick={()=> setIsModalOpen(true)} icon={<PlusSquareOutlined />}>
        Додати актив
      </Button>
      <AddAssetModal open={isModalOpen} onClose={()=> setIsModalOpen(false)} />
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
