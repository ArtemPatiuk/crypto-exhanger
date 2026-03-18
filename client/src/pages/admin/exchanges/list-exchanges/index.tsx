import { useEffect, useState } from 'react';
import { Table, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExchangeRequest } from "../../../../app/types/exhangerequest";
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../../../paths';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { useGetAllExchangesQuery } from '../../../../app/services/exchanges';
import moment from 'moment';
import { useGetAllAssetsQuery } from '../../../../app/services/assets';




const formatDateTime = (dateTime: Date) => {
  return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
}
const assetFilters = [
  { text: 'USDT', value: 'USDT' },
  { text: 'BTC', value: 'BTC' },
  { text: 'ETH', value: 'ETH' },
  { text: 'BNB', value: 'BNB' },
];

export const ListExchanges = () => {
const [filters, setFilters] = useState<{
      coins?: string[];
      networks?: string[];
      isActive?: boolean;
    }>({});
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllExchangesQuery();
  const { data: assetsData } = useGetAllAssetsQuery({
    pagination: { page: 1, limit: 100 },
    filters: { isActive: true }
  });
  const user = useSelector(selectUser);
  const [api, contextHolder] = notification.useNotification();


  useEffect(() => {
    const successRemoveExchangeMessage = localStorage.getItem('deleteSuccessExchanges');
    if (successRemoveExchangeMessage) {
      api.success({
        message: 'Вітаю!',
        description: successRemoveExchangeMessage,
      });
      localStorage.removeItem('deleteSuccessExchanges');
    }
    const successSendCryptoMessage = localStorage.getItem('SendSuccessExchanges');
    if (successSendCryptoMessage) {
      api.success({
        message: 'Вітаю!',
        description: successSendCryptoMessage,
      });
      localStorage.removeItem('SendSuccessExchanges');
    }

  }, [api]);


  useEffect(() => {
    if (!user || !user.role.includes('ADMIN')) {
      navigate(Paths.home);
    }
  }, [user]);


  const colums: ColumnsType<ExchangeRequest> = [
    {
      title: "Користувач",
      dataIndex: ["user", "email"],
      key: "userId",
    },
    {
      title: "Віддаєте",
      dataIndex: ["assetFrom", "name"],
      key: "assetFromId",
      filters: assetFilters,
    },
    {
      title: "Отримуєте",
      dataIndex: ["assetTo", "name"],
      key: "assetToId",
      filters: assetFilters,
    },
    {
      title: "К-сть активів",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Комісія",
      dataIndex: "commission",
      key: "commission",
    },
    {
      title: "Обмінний курс",
      dataIndex: "exchangeRate",
      key: "exchangeRate",
    },
    {
      title: "Ви отримаєте",
      dataIndex: "totalSum",
      key: "totalSum",
    },
    {
      title: "Адреса для отримання",
      dataIndex: "recipientAddress",
      key: "recipientAddress",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Дата",
      dataIndex: "Date",
      key: "Date",
      render: (date) => formatDateTime(date)
    },
  ]
  return (
    <div style={{ minHeight: '67vh' }}>
      {contextHolder}
      <h2 style={{ textAlign: "center" }}>Список всіх заявок</h2>
      <br></br>
      <Table
        loading={isLoading}
        dataSource={data}
        pagination={false}
        columns={colums}
        rowKey={(record) => record.id}
        onRow={(record) => {
          return {
            onClick: () => navigate(`${Paths.exchangeProfile}/${record.id}`),
          };
        }}
      />
      <br></br>
    </div>
  )
}
