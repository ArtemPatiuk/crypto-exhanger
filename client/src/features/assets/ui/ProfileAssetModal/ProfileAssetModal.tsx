import { Button, Card, Col, Descriptions, Divider, Modal, notification, Row, Segmented, Space, Spin, Switch, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAssetByIdQuery, useRemoveAssetMutation, useEditAssetMutation } from '../../../../app/services/assets';
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../../../components/error-message';
import styles from './index.module.css';
import { useProfileAsset } from './useProfileAsset';



export const ProfileAssetModal = () => {
	const {
		data, isLoading, status,
		deleteModalOpen, setDeleteModalOpen,
		updating, handleUpdateStatus,
		handleDelete, handleClose, isOpen, contextHolder, handleStatusChange, isDirty, deleting
	} = useProfileAsset();

	if (isLoading || !data) {
		return (
			<Modal open={isOpen} footer={null} onCancel={handleClose} centered>
				<div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>
			</Modal>
		);
	}
	return (
		<>
			{contextHolder}

			<Modal
				open={isOpen}
				onCancel={handleClose}
				footer={null}
				width={600}
				centered
				className={styles.assetModal}
			>
				<div className={styles.modalHeader}>
					<div className={styles.assetInfo}>
						<img src={data.coin.imageUrl} className={styles.assetIcon} />

						<div>
							<p className={styles.noMargin}>
								{data.coin.symbol}
							</p>
							<p>{data.chainName}</p>
						</div>
					</div>

					<Tag color={status ? "success" : "error"} style={{ marginRight: '25px' }}>
						{status ? "Активний" : "Вимкнений"}
					</Tag>
				</div>

				<Divider />

				<Row gutter={[16, 20]}>
					<Col span={12}>
						<p>Монета</p>
						<div className="value">{data.coin.symbol}</div>
					</Col>

					<Col span={12}>
						<p>Мережа</p>
						<div className="value">{data.chainName}</div>
					</Col>

					<Col span={12}>
						<p>Мінімум</p>
						<div className="value">
							{Number(data.withdrawMin)} {data.coin.symbol}
						</div>
					</Col>

					<Col span={12}>
						<p>Комісія</p>
						<div className="value">
							{Number(data.withdrawFee)} {data.coin.symbol}
						</div>
					</Col>

					<Col span={24}>
						<p>Максимум</p>
						<div className="value">
							{Number(data.withdrawMax)} {data.coin.symbol}
						</div>
					</Col>
				</Row>

				<Divider />

				<div className={styles.modalActions}>
					<Space>
						<p>Статус</p>

						<Switch
							checked={status ?? data.isActive}
							onChange={handleStatusChange}
							loading={updating}
						/>

						{isDirty && (
							<Button
								type="primary"
								loading={updating}
								onClick={handleUpdateStatus}
							>
								Зберегти
							</Button>
						)}
					</Space>

					<Button
						danger
						icon={<DeleteOutlined />}
						onClick={() => setDeleteModalOpen(true)}
					>
						Видалити
					</Button>
				</div>
			</Modal>

			<Modal
				title="Підтвердження"
				open={deleteModalOpen}
				onOk={handleDelete}
				confirmLoading={deleting}
				onCancel={() => setDeleteModalOpen(false)}
				okText="Видалити"
				cancelText="Скасувати"
			>
				Ви впевнені, що хочете видалити актив?
			</Modal>
		</>
	);
};