import { Button, Card, Col, Descriptions, Divider, Modal, notification, Row, Segmented, Space, Spin, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAssetByIdQuery, useRemoveAssetMutation, useEditAssetMutation } from '../../../app/services/assets';
import { ErrorValidator, getErrors } from '../../../utils/get-errors';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../error-message';

type Props = {
	open: boolean;
	onClose: () => void;
	id: string | null;
};

export const ProfileAssetModal = ({ open, onClose, id }: Props) => {
	;
	const [error, setError] = useState<ErrorValidator[]>([])
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const { data, isLoading } = useGetAssetByIdQuery(id!, {
		skip: !id
	});
	const [status, setStatus] = useState<boolean>(false)


	const [updateAsset, { isLoading: updating }] = useEditAssetMutation();
	const [removeAsset] = useRemoveAssetMutation();

	const [api, contextHolder] = notification.useNotification();

	useEffect(() => {
		if (data) {
			setStatus(data.isActive)
		}
	}, [data])

	if (isLoading) {
		return <Spin size="large" />;
	}
	const handleUpdateStatus = async () => {
		if (!data) return;

		try {
			await updateAsset({
				id: data.id,
				isActive: status
			}).unwrap();
			data.isActive = status;

			api.success({
				message: "Статус змінено",
				description: "Статус активу успішно оновлено"
			});

		} catch (error) {
			setError(getErrors(error));
		}
	};
	const handleDeleteAsset = async () => {
		if (!data) return;

		try {
			await removeAsset(data.id).unwrap();

			api.success({
				message: "Актив видалено"
			});

			setDeleteModalOpen(false);
			onClose();

		} catch (error) {
			setError(getErrors(error));
		}
	};

	if (isLoading || !data) return null;
	return (
		<>
			{contextHolder}
			<Modal
				open={open}
				onCancel={onClose}
				footer={null}
				width={700}
				centered
			>
				<Space align="center" size="middle">
					<img
						src={data.coin.imageUrl}
						width={40}
						height={40}
						style={{ borderRadius: "50%" }}
					/>
					<div>
						<Typography.Title level={4} style={{ margin: 0 }}>
							{data.coin.symbol}
						</Typography.Title>

						<Typography.Text type="secondary">
							{data.chainName}
						</Typography.Text>
					</div>

					<Tag color={status ? "green" : "red"}>
						{status ? "Активний" : "Вимкнений"}
					</Tag>
				</Space>
				<Card>
					<Row gutter={[16, 16]}>

						<Col span={12}>
							<Typography.Text type="secondary">
								Монета
							</Typography.Text>

							<div>{data.coin.symbol}</div>
						</Col>

						<Col span={12}>
							<Typography.Text type="secondary">
								Мережа
							</Typography.Text>

							<div>{data.chainName}</div>
						</Col>

						<Col span={24}>
							<Typography.Text type="secondary">
								Мінімальна сума внеску
							</Typography.Text>

							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<span>{Number(data.withdrawMin)} {data.coin.symbol}</span>
							</div>
						</Col>
						<Col span={24}>
							<Typography.Text type="secondary">
								Комісія мережі
							</Typography.Text>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<span>{Number(data.withdrawFee)} {data.coin.symbol}</span>
							</div>
						</Col>
						<Col span={24}>
							<Typography.Text type="secondary">
								Максимальна сума внеску
							</Typography.Text>

							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<span>{Number(data.withdrawMax)} {data.coin.symbol}</span>
							</div>
						</Col>
						<Col span={24}>
							<Typography.Text type="secondary">
								Cтатус
							</Typography.Text>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<Segmented
									options={[
										{ label: "Активний", value: "active" },
										{ label: "Вимкнений", value: "inactive" }
									]}
									value={status ? "active" : "inactive"}
									onChange={(value) => setStatus(value === "active")}
								/>

								{status !== data.isActive && (
									<Button
										type="primary"
										loading={updating}
										onClick={handleUpdateStatus}
									>
										Підтвердити зміну
									</Button>
								)}
							</div>

						</Col>
						<Button
							danger
							icon={<DeleteOutlined />}
							onClick={() => setDeleteModalOpen(true)}
						>
							Видалити
						</Button>
					</Row>
				</Card>
			</Modal>
			<Modal
				title="Підтвердіть видалення"
				open={deleteModalOpen}
				onOk={handleDeleteAsset}
				onCancel={() => setDeleteModalOpen(false)}
				okText="Підтвердити"
				cancelText="Скасувати"
			>
				Ви справді бажаєте видалити актив?
			</Modal>

		</>
	)
};