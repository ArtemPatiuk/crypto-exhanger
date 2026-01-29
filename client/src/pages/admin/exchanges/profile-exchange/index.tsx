import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { Button, Descriptions, Divider, Modal, Space, Spin } from 'antd';
import { Paths } from '../../../../paths';
import { DeleteOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { ErrorMessage } from '../../../../components/error-message';
import { useGetExchangeByIdQuery, useRemoveExchangeMutation, useSendCryptoMutation } from '../../../../app/services/exchanges';

export const ProfileExchange = () => {
    const navigate = useNavigate();

    const [error, setError] = useState<ErrorValidator[]>([])
    const params = useParams<{ id: string }>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    const { data, isLoading } = useGetExchangeByIdQuery(params.id || "");

    const [removeExchange] = useRemoveExchangeMutation();
    const [sendCrypto] = useSendCryptoMutation();
    const user = useSelector(selectUser);

    if (isLoading) {
        return <Spin size="large" />;
    }
    if (!data) {
        navigate(Paths.exchangesList)
        return null;
    }
    const showModalRemove = () => {
        setIsModalOpen(true);
    }

    const hideModalRemove = () => {
        setIsModalOpen(false);
    }
    const showSendModal = () => {
        setIsSendModalOpen(true);
    }

    const hideSendModal = () => {
        setIsSendModalOpen(false);
    }



    const handleDeleteReview = async () => {
        hideModalRemove();
        try {
            await removeExchange(data.id).unwrap();
            localStorage.setItem('deleteSuccessExchanges', 'Заявка успішно видалена!');
            navigate(`${Paths.admin}/exchanges`);
        } catch (error) {
            setError(getErrors(error));
        }
    }


    const handleSendCrypto = async () => {
        hideSendModal();
        try {
            await sendCrypto(data.id).unwrap();
            localStorage.setItem('SendSuccessExchanges', 'Кошти успішно надіслані');
            navigate(`${Paths.admin}/exchanges`);
        } catch (error) {
            setError(getErrors(error));
        }
    }

    return (
        <div style={{ width: "40%", alignItems: "center", justifyContent: "center" }}>
            <Descriptions title="Заявка" bordered >
                <Descriptions.Item label="Актив який відправляється" span={3}>
                    {data?.assetFrom?.coin}
                </Descriptions.Item>
                <Descriptions.Item label="Актив який отримується" span={3}>
                    {`${data?.assetTo?.coin}`}
                </Descriptions.Item>
                <Descriptions.Item label="К-сть активів" span={3}>
                    {`${data.amount}`}
                </Descriptions.Item>
                <Descriptions.Item label="Комісія" span={3}>
                    {`${data.commission}`}
                </Descriptions.Item>
                <Descriptions.Item label="Обмінний курс" span={3}>
                    {`${data.exchangeRate}`}
                </Descriptions.Item>
                <Descriptions.Item label="Загальна сума" span={3}>
                    {`${data.totalSum}`}
                </Descriptions.Item>
                <Descriptions.Item label="Адреса для отримання" span={3}>
                    {`${data.recipientAddress}`}
                </Descriptions.Item>
                <Descriptions.Item label="Статус" span={3}>
                    {`${data.status}`}
                </Descriptions.Item>
            </Descriptions>
            {user?.role.includes("ADMIN") &&
                <>
                    <Divider orientation='left'>Дії</Divider>
                    <Space>
                        <Button shape='round' type='default' onClick={showSendModal} icon={<CheckCircleTwoTone />}>Відправити</Button>
                        <Button shape='round' danger onClick={showModalRemove} icon={<DeleteOutlined />}>Видалити</Button>
                    </Space>
                </>
            }
            <ErrorMessage errors={error} />
            <Modal
                title="Підтвердіть видалення"
                open={isModalOpen}
                onOk={handleDeleteReview}
                onCancel={hideModalRemove}
                okText="Підвердити"
                cancelText="Скасувати"
            >
                Ви справді бажаєте видалити запис?
            </Modal>
            <Modal
                title="Підтвердіть відправку"
                open={isSendModalOpen}
                onOk={handleSendCrypto}
                onCancel={hideSendModal}
                okText="Підтвердити"
                cancelText="Скасувати"
            >
                Ви справді бажаєте оновити статус заявки?
            </Modal>
        </div>
    )
}
//to={`${Paths.exchangeEdit}/${data.id}`