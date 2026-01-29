import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';
import { useGetAssetByIdQuery, useRemoveAssetMutation } from '../../../../app/services/assets';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { Button, Descriptions, Divider, Modal, Space, Spin, notification } from 'antd';
import { Paths } from '../../../../paths';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../../../components/error-message';

export const ProfileAsset = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<ErrorValidator[]>([])
    const params = useParams<{ id: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useGetAssetByIdQuery(params.id || "");
    const [removeAsset] = useRemoveAssetMutation();
    const user = useSelector(selectUser);

    const [api, contextHolder] = notification.useNotification();

    if (isLoading) {
        return <Spin size="large" />;
    }
    if (!data) {
        navigate(Paths.admin)
        return null;
    }
    const showModal = () => {
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    }
    const handleDeleteAsset = async () => {
        hideModal();

        try {
            await removeAsset(data.id).unwrap();
            localStorage.setItem('deleteSuccessAssets', 'Актив успішно видалений!');
            navigate(`${Paths.admin}/assets`);
        } catch (error) {
            setError(getErrors(error));
        }
    }
    return (
        <div style={{ width: "45%", alignItems: "center", justifyContent: "center", minHeight: '67vh' }}>
            {contextHolder}
            <Descriptions title="Актив" bordered >
                <Descriptions.Item label="Ім'я" span={3}>
                    {`${data.coin}`}
                </Descriptions.Item>
                <Descriptions.Item label="Мережа" span={3}>
                    {`${data.network}`}
                </Descriptions.Item>
                <Descriptions.Item label="Підпис мережі" span={3}>
                    {`${data.networkSignature}`}
                </Descriptions.Item>
                <Descriptions.Item label="Адреса для отримання" span={3}>
                    {`${data.address}`}
                </Descriptions.Item>
            </Descriptions>
            {user?.id === data.createdById &&
                <>
                    <Divider orientation='left'>Дії</Divider>
                    <Space>
                        <Link to={`${Paths.assetsEdit}/${data.id}`}>
                            <Button shape='round' type='default' icon={<EditOutlined />}>Редагувати</Button>
                        </Link>
                        <Button shape='round' danger onClick={showModal} icon={<DeleteOutlined />}>Видалити</Button>
                    </Space>
                </>
            }
            <ErrorMessage errors={error} />
            <Modal
                title="Підтвердіть видалення"
                open={isModalOpen}
                onOk={handleDeleteAsset}
                onCancel={hideModal}
                okText="Підвердити"
                cancelText="Скасувати"
            >
                Ви справді бажаєте видалити запис?
            </Modal>
        </div>
    )
}
