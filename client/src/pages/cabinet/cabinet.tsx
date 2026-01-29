import { useEffect } from 'react';
import {Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExchangeRequest } from '../../app/types/exhangerequest';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { useGetAllExchangesUsersQuery } from '../../app/services/exchanges';
import moment from 'moment';



const formatDateTime = (dateTime:Date) => {
  return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

const colums:ColumnsType<ExchangeRequest> = [
  {
    title: "Віддаєте",
    dataIndex: ["assetFrom", "coin"],
    key: "assetFrom",
  },
  {
    title: "Отримуєте",
    dataIndex: ["assetTo", "coin"],
    key: "assetTo",
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
    title: "Адреса для отримування",
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


const Cabinet = () => {
  const navigate = useNavigate();
  const {data,isLoading} = useGetAllExchangesUsersQuery();
  const user = useSelector(selectUser);

  useEffect(()=>{
      if(!user){
        navigate(Paths.home)
      }
    },[])

  return (
    <div style={{minHeight: '67vh'}}>
      <h2 style={{textAlign:"center"}}>Ваші заявки</h2>
            <Table
                loading={isLoading}
                dataSource={data}
                pagination={false}
                columns={colums}
                rowKey={(record) => record.id}
            />
        </div>
  );
};



export default Cabinet;