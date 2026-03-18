import { Row, Col, Modal, Descriptions, notification, Typography, Space, QRCode } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { Paths } from '../../../../paths';
import { ExchangeRequest } from "../../../../app/types/exhangerequest";
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';
//import { ExchangeForm } from '../../../../components/forms/form-exchange';
import { useAddExchangeMutation } from '../../../../app/services/exchanges';
import { useGetAllAssetsQuery } from '../../../../app/services/assets';
import { MoneyCollectOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const CreateExchange = () => {
  const [filters, setFilters] = useState<{
    coins?: string[];
    networks?: string[];
    isActive?: boolean;
  }>({});
  const { data: assetsData, isLoading } = useGetAllAssetsQuery({
    pagination: { page: 1, limit: 100 }, 
    filters: { isActive: true }
  });
  const [errors, setError] = useState<ErrorValidator[]>([]);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [AddExchange] = useAddExchangeMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<ExchangeRequest | null>(null);

  const [api, contextHolder] = notification.useNotification();

  const handleAddAsset = (data: ExchangeRequest) => {
    if (user) {
      setFormData(data);
      setIsModalVisible(true);
    } else {
      handleToLogin();
    }
  };
  useEffect(() => {
    const successMessage = localStorage.getItem('exchangeSuccessMessage');
    if (successMessage) {
      api.success({
        message: 'Вітаю!',
        description: successMessage,
      });
      localStorage.removeItem('exchangeSuccessMessage');
    }
  }, [api])

  const handleCreateRequest = async () => {
    if (formData) {
      try {
        await AddExchange(formData).unwrap();
        localStorage.setItem('exchangeSuccessMessage', "Заявку успішно створено, ви можете переглянути деталі в особистому кабінеті");
        window.location.reload();
      } catch (error) {
        const errData = getErrors(error);
        setError(errData);
        api.error({
          message: 'Помилка',
          description: errData.map(err => err.msg).join(', '),
        });
      } finally {
        setIsModalVisible(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData(null);
  };

  const handleToLogin = () => {
    const btn = (
      <Space>

      </Space>
    );
    api.error({
      message: 'Помилка',
      description: 'Щоб створити заявку потрібно авторизуватись в системі',
      btn,
    });
  };
  return (
    <div>
      {contextHolder}
      <Row align="middle" justify="center">
        <Col xs={24} md={24} lg={24}>
         
        </Col>
      </Row>
      <Modal
        open={isModalVisible}
        onOk={handleCreateRequest}
        onCancel={handleCancel}
        okText="Створити заявку"
        cancelText="Відхилити заявку"
        width={1000}
      >
        <Title>Перед створенням заявки перевірте умови обміну!</Title>
        <Descriptions bordered>
          <Descriptions.Item label="К-сть активів" span={3}>
            {formData?.amount}
          </Descriptions.Item>
          <Descriptions.Item label="Комісія" span={3}>
            {formData?.commission}
          </Descriptions.Item>
          <Descriptions.Item label="Обмінний курс" span={3}>
            {formData?.exchangeRate}
          </Descriptions.Item>
          <Descriptions.Item label="Адреса для отримання" span={3}>
            {formData?.recipientAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Сума до отримання" span={3}>
            {formData?.totalSum}
          </Descriptions.Item>
        </Descriptions>

        <Title level={1}>Як відбувається процес обміну</Title>
        <Paragraph >Вам потрібно відправити вказаний актив на вказану адресу. Заявка буде розглянута адміністратором. Якщо ваша заявка буде затверджена, ви отримаєте активи на вказану адресу.</Paragraph>
        <Paragraph>Перед відправленням активів перевірте всю інформацію у заявці щодо обмінного курсу, кількості активів та адреси для отримання. Ви зможете переглянути деталі вашої заявки в особистому кабінеті.</Paragraph>
        <Paragraph >Якщо у вас є будь-які питання або потребуєте додаткової інформації, будь ласка, зв'яжіться з адміністратором за допомогою контактних даних, вказаних на сайті.</Paragraph>
        <Title level={2}>Адреса для відправлення активу</Title>
      </Modal>
    </div>
  );
};
